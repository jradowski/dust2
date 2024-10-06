import { useUser } from '@/UserContext'; // Upewnij się, że importujesz z poprawnej ścieżki

const SomeComponent = () => {
    const { user } = useUser(); // Teraz powinno działać poprawnie

    return (
        <div>
            {user ? (
                <p>Witaj, {user.email}!</p>
            ) : (
                <p>Nie jesteś zalogowany.</p>
            )}
        </div>
    );
};