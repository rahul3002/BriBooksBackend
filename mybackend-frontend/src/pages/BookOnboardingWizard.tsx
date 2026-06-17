import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { WizardProgress } from '../components/wizard/WizardProgress';
import { GenreSelection } from '../components/wizard/GenreSelection';
import { ThemeSelection } from '../components/wizard/ThemeSelection';
import { BookDetailsForm } from '../components/wizard/BookDetailsForm';
import { booksService } from '../services/api/books.service';
import { useAuth } from '../context/AuthContext';

interface ApiError {
    response?: {
        data?: {
            error?: {
                message?: string;
            };
            message?: string;
        };
        status?: number;
    };
    message?: string;
}

interface WizardState {
    step: 1 | 2 | 3;
    selectedGenre: string | null;
    selectedTheme: string | null;
    bookDetails: {
        title: string;
        description: string;
        ageGroup: string;
    };
}

export const BookOnboardingWizard: React.FC = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [wizardState, setWizardState] = useState<WizardState>({
        step: 1,
        selectedGenre: null,
        selectedTheme: null,
        bookDetails: {
            title: '',
            description: '',
            ageGroup: 'MIDDLE_GRADE',
        },
    });

    // Restore wizard state if returning from login
    React.useEffect(() => {
        console.log('=== Restoration useEffect ===');
        console.log('user:', user);
        console.log('isAuthenticated:', isAuthenticated);

        const pendingReturn = sessionStorage.getItem('pendingWizardReturn');
        const savedState = sessionStorage.getItem('wizardState');

        console.log('pendingReturn:', pendingReturn);
        console.log('savedState exists:', !!savedState);

        if (pendingReturn === 'true' && savedState && user) {
            try {
                const parsedState = JSON.parse(savedState);
                console.log('Restoring wizard state:', parsedState);
                setWizardState(parsedState);
                // Clear the flags
                sessionStorage.removeItem('pendingWizardReturn');
                sessionStorage.removeItem('wizardState');
            } catch (error) {
                console.error('Error restoring wizard state:', error);
            }
        }
    }, [user, isAuthenticated]);

    const goToNextStep = () => {
        if (wizardState.step < 3) {
            setWizardState((prev) => ({
                ...prev,
                step: (prev.step + 1) as 1 | 2 | 3,
            }));
        }
    };

    const goToPreviousStep = () => {
        if (wizardState.step > 1) {
            setWizardState((prev) => ({
                ...prev,
                step: (prev.step - 1) as 1 | 2 | 3,
            }));
        }
    };

    const handleGenreSelect = (genreId: string) => {
        setWizardState((prev) => ({
            ...prev,
            selectedGenre: genreId,
        }));
        // Auto-advance to theme selection
        setTimeout(() => goToNextStep(), 300);
    };

    const handleThemeSelect = (themeId: string) => {
        setWizardState((prev) => ({
            ...prev,
            selectedTheme: themeId,
        }));
    };

    const handleBookDetailsChange = (details: WizardState['bookDetails']) => {
        setWizardState((prev) => ({
            ...prev,
            bookDetails: details,
        }));
    };

    const handleCreateBook = async () => {
        // Debug logging
        console.log('=== Create Book Attempt ===');
        console.log('isAuthenticated:', isAuthenticated);
        console.log('user:', user);
        console.log('token:', localStorage.getItem('token'));

        // Check if user is logged in using isAuthenticated flag
        if (!isAuthenticated || !user) {
            console.log('Not authenticated - redirecting to login');
            // Save wizard state to restore after login
            sessionStorage.setItem('wizardState', JSON.stringify(wizardState));
            sessionStorage.setItem('pendingWizardReturn', 'true');
            navigate('/login?returnTo=/start-writing');
            return;
        }

        console.log('User is authenticated - proceeding to create book');

        // Log the exact data being sent
        console.log('Book data being sent:');
        console.log('- Title:', wizardState.bookDetails.title);
        console.log('- Description:', wizardState.bookDetails.description);
        console.log('- Age Group:', wizardState.bookDetails.ageGroup);
        console.log('- Tags:', wizardState.selectedGenre ? [wizardState.selectedGenre] : []);

        // User is logged in, create the book
        try {
            const response = await booksService.createBook(
                wizardState.bookDetails.title,
                wizardState.bookDetails.description,
                wizardState.bookDetails.ageGroup,
                wizardState.selectedGenre ? [wizardState.selectedGenre] : []
            );

            console.log('Book created successfully:', response.data);
            const bookId = response.data.id;

            // Store selected theme for editor
            if (wizardState.selectedTheme) {
                sessionStorage.setItem('selectedTheme', wizardState.selectedTheme);
            }

            // Clear wizard state
            sessionStorage.removeItem('wizardState');
            sessionStorage.removeItem('pendingWizardReturn');

            // Navigate to editor
            navigate(`/editor/${bookId}`);
        } catch (error: unknown) {
            console.error('Error creating book:', error);
            const err = error as ApiError;

            // Handle authentication errors
            if (err.response?.status === 401 || err.response?.status === 403) {
                console.error('API returned auth error - token may be invalid');
                // Token might be expired, save state and redirect
                sessionStorage.setItem('wizardState', JSON.stringify(wizardState));
                sessionStorage.setItem('pendingWizardReturn', 'true');
                // Clear invalid token
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login?returnTo=/start-writing');
            } else {
                // Re-throw for form error handling
                throw new Error(err.response?.data?.message || 'Failed to create book. Please try again.');
            }
        }
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
            {/* Progress Indicator */}
            <WizardProgress currentStep={wizardState.step} totalSteps={3} />

            {/* Wizard Steps */}
            <div className="pb-12">
                <AnimatePresence mode="wait">
                    {wizardState.step === 1 && (
                        <GenreSelection key="genre" onSelect={handleGenreSelect} />
                    )}

                    {wizardState.step === 2 && wizardState.selectedGenre && (
                        <ThemeSelection
                            key="theme"
                            selectedGenre={wizardState.selectedGenre}
                            selectedTheme={wizardState.selectedTheme}
                            onSelect={handleThemeSelect}
                            onBack={goToPreviousStep}
                            onNext={goToNextStep}
                        />
                    )}

                    {wizardState.step === 3 && (
                        <BookDetailsForm
                            key="details"
                            details={wizardState.bookDetails}
                            onChange={handleBookDetailsChange}
                            onBack={goToPreviousStep}
                            onSubmit={handleCreateBook}
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* Back to Home Link */}
            <div className="fixed bottom-4 left-4">
                <button
                    onClick={() => navigate('/')}
                    className="text-sm text-slate-600 hover:text-slate-900 underline"
                >
                    ← Back to Home
                </button>
            </div>
        </div>
    );
};
