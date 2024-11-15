import { useUser } from '@/UserContext'; // Upewnij się, że importujesz z poprawnej ścieżki

const SomeComponent = () => {
    const { user } = useUser(); // Teraz powinno działać poprawnie

    return (
        <div>
            {user ? (
                <p>{user.email}!</p>
            ) : (
                <p>Zaloguj</p>
            )}
        </div>
    );
};