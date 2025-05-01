/**
 * WeightChart komponentas
 *
 * Šis komponentas atvaizduoja vartotojo svorio istorijos grafiką naudojant Recharts biblioteką.
 * Duomenys gaunami iš backend'o API ir atvaizduojami linijiniame grafike.
 *
 *
 * - Gauname svorio istorijos duomenis iš API
 * - Formatuojame duomenis tinkamu formatu grafikui
 * - Nustatome Y ašies ribas (-20 kg nuo min svorio iki +20 kg nuo max svorio)
 * - Rodome krovimo būseną ir klaidas
 * - Atvaizduoja svorio kitimą laike
 */
import { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";

// API URL iš aplinkos kintamųjų
const API_URL = import.meta.env.VITE_API_URL;

const WeightChart = () => {
  // Būsenos kintamieji
  const [weightHistory, setWeightHistory] = useState([]); // Svorio istorijos duomenys
  const [isLoading, setIsLoading] = useState(true); // Krovimo būsena
  const [error, setError] = useState(null); // Klaidų būsena
  const [yAxisDomain, setYAxisDomain] = useState(["auto", "auto"]); // Y ašies ribos

  useEffect(() => {
    /**
     * Funkcija, kuri gauna svorio istorijos duomenis iš API
     * ir juos formatuoja grafikui
     */
    const fetchWeightHistory = async () => {
      try {
        setIsLoading(true); // Nustatome krovimo būseną
        // Siunčiame užklausą į API
        const response = await axios.get(`${API_URL}/characteristics/history`, {
          withCredentials: true, // Siunčiame slapukus autentifikacijai
        });

        if (response.data.status === "success") {
          // Formatuojame duomenis grafikui
          const formattedData = response.data.data.map((entry) => ({
            name: format(parseISO(entry.date), "MMM d"), // Formatuojame datą
            weight: parseFloat(entry.weight), // Konvertuojame svorį į skaičių
            date: entry.date, // Išsaugome originalią datą
            id: entry.id, // Išsaugome įrašo ID
          }));

          // Rūšiuojame pagal datą didėjimo tvarka
          formattedData.sort((a, b) => new Date(a.date) - new Date(b.date));

          // Nustatome svorio istorijos duomenis
          setWeightHistory(formattedData);

          // Nustatome Y ašies ribas
          if (formattedData.length > 0) {
            // Ištraukiame visus svorio duomenis
            const weights = formattedData.map((item) => item.weight);
            const minWeight = Math.min(...weights); // Randame mažiausią svorį
            const maxWeight = Math.max(...weights); // Randame didžiausią svorį

            // Nustatome Y ašies ribas nuo -20 kg iki +20 kg
            setYAxisDomain([minWeight - 20, maxWeight + 20]);
          }
        }
      } catch (err) {
        // Klaidos apdorojimas
        console.error("Failed to fetch weight history:", err);
        setError(
          err.response?.data?.message || "Failed to fetch weight history"
        );
      } finally {
        // Baigus užklausą, nustatome krovimo būseną į false
        setIsLoading(false);
      }
    };

    // Iškviečiame funkciją duomenims gauti
    fetchWeightHistory();
  }, []);
  // Jei duomenys dar kraunasi, rodome krovimo pranešimą
  if (isLoading) {
    return <div>Loading weight history...</div>;
  }

  // Jei įvyko klaida, rodome klaidos pranešimą
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Jei nėra svorio istorijos duomenų, rodome informacinį pranešimą
  if (weightHistory.length === 0) {
    return (
      <div>
        No weight history available. Please add your weight in the
        characteristics form.
      </div>
    );
  }

  // Jei duomenys sėkmingai užkrauti, rodome grafiką
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500} // Grafiko plotis
        height={300} // Grafiko aukštis
        data={weightHistory} // Duomenys grafikui
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }} // Grafiko paraštės
      >
        <CartesianGrid strokeDasharray="3 3" /> {/* Tinklelis */}
        <XAxis dataKey="name" />{" "}
        {/* X ašis, naudojant 'name' lauką iš duomenų */}
        <YAxis
          type="number" // Y ašies tipas - skaičiai
          domain={yAxisDomain} // Y ašies ribos
          label={{ value: "Weight (kg)", angle: -90, position: "insideLeft" }} // Y ašies pavadinimas
        />
        <Tooltip /> {/* Paaiškinimas, rodomas užvedus pelę */}
        <Legend /> {/* Legenda */}
        <Line
          type="monotone" // Linijos tipas
          dataKey="weight" // Duomenų laukas, naudojamas Y reikšmėms
          stroke="var(--color-recipe-primary)" // Linijos spalva
          // stroke="#8979FF" // Linijos spalva
          activeDot={{ r: 8 }} // Aktyvaus taško dydis
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default WeightChart;
