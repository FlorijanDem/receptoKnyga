import React, { useState, useEffect } from 'react';

const EditRecipe = ({ user, match }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);  // Naujas state, kad parodytumėte įkrovimo būseną

  const recipeId = match.params.id; // Gaukite recepto ID iš URL

  // Tikrinimas, ar vartotojas užblokuotas
  if (user?.isBanned) {
    return (
      <div style={{ color: 'red', fontWeight: 'bold' }}>
        Jūs esate užblokuotas ir negalite redaguoti receptų.
      </div>
    );
  }

  // Gauti recepto duomenis pagal ID (naudojame useEffect)
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true); // Pradedame įkrovimo būseną
        const res = await fetch(`http://localhost:3001/api/recipes/${recipeId}`);
        if (!res.ok) {
          throw new Error('Nepavyko gauti recepto duomenų');
        }
        const data = await res.json();
        setTitle(data.title);
        setDescription(data.description);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false); // Baigiame įkrovimo būseną
      }
    };

    fetchRecipe();
  }, [recipeId]);

  // Redaguoti receptą
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:3001/api/recipes/${recipeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`, // jei naudojat JWT
        },
        body: JSON.stringify({ title, description }),
      });

      if (res.status === 403) {
        setErrorMessage('Tu esi užblokuotas ir negali redaguoti receptų.');
        return;
      }

      if (!res.ok) {
        throw new Error('Klaida redaguojant receptą');
      }

      const data = await res.json();
      setSuccessMessage('Receptas buvo sėkmingai atnaujintas!');
      console.log('Receptas atnaujintas:', data);
    } catch (error) {
      setErrorMessage(error.message || 'Įvyko klaida. Bandykite vėl.');
      console.error('Klaida:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Redaguoti receptą</h2>

      {/* Jei yra įkrovimo būsenos */}
      {loading && <div>Įkeliama...</div>}

      {/* Klaidos ir sėkmės pranešimai */}
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Pavadinimas"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Aprašymas"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        <button type="submit" disabled={loading}>Atnaujinti</button>
      </form>
    </div>
  );
};

export default EditRecipe;
