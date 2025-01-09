'use client';

import { useEffect } from 'react';

const Page = () => {
    useEffect(() => {
        // Sprawdzenie w sessionStorage, czy strona była wcześniej odświeżona
        const hasRefreshed = sessionStorage.getItem('hasRefreshed');
        
        if (!hasRefreshed) {
            sessionStorage.setItem('hasRefreshed', 'true'); // Oznaczenie, że strona została odświeżona
            window.location.reload(); // Jednorazowe odświeżenie
        } else {
            sessionStorage.removeItem('hasRefreshed'); // Usunięcie flagi po odświeżeniu
        }
    }, []); // Uruchamia się tylko raz, kiedy komponent jest załadowany

    return <div>Strona została odświeżona!</div>;
};

export default Page;
