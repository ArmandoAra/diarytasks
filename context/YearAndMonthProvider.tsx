import React, { createContext, useContext, useState, useEffect, ReactNode, FC } from 'react';


import { getMonthByNumber } from '@/utils/getMonth';
// Definición de la interfaz del contexto YearAndMonth
interface YearAndMonthContextProps {
    selectedYear: number;
    selectedMonth: string;
    setSelectedYear: React.Dispatch<React.SetStateAction<number>>;
    setSelectedMonth: React.Dispatch<React.SetStateAction<string>>
}

// Contexto YearAndMonth
const YearAndMonthContext = createContext<YearAndMonthContextProps>({
    selectedYear: 0,
    selectedMonth: '',
    setSelectedYear: () => { },
    setSelectedMonth: () => { },
});

export const useYearAndMonthContext = () => useContext(YearAndMonthContext);

interface YearAndMonthProviderProps {
    children: ReactNode;
}

const currentYear = new Date().getFullYear();
const currentMonth = getMonthByNumber(new Date().getMonth());

export const YearAndMonthProvider: FC<YearAndMonthProviderProps> = ({ children }) => {

    const [selectedYear, setSelectedYear] = useState<number>(currentYear);
    const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);

    return (
        <YearAndMonthContext.Provider
            value={{
                selectedYear,
                selectedMonth,
                setSelectedYear,
                setSelectedMonth,
            }}
        >
            {children}
        </YearAndMonthContext.Provider>
    );
};
