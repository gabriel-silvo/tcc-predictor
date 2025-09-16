import axios from 'axios';
import React, { useState } from 'react';
import { View, TextInput, Button, Text, ActivityIndicator } from 'react-native';

function Predictor() {
  const [smiles, setSmiles] = useState('CCO'); // Exemplo: SMILES para a molécula de Etanol
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePredict = async () => {
    if (!smiles) {
      setError('Por favor, insira uma string SMILES.');
      return;
    }
    
    setLoading(true);
    setPrediction(null);
    setError('');

    const apiUrl = 'https://gnn-api-production.up.railway.app/predict'; // A URL do endpoint
    const requestBody = {
      smiles: smiles, // SMILES
    };

    try {
      console.log('Enviando para a API:', apiUrl);
      console.log('Corpo da requisição:', requestBody);
      
      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json', // Envio via .JSON
        },
      });

      console.log('Resposta recebida:', response.data);
      setPrediction(response.data);

    } catch (err) {
      console.error('Erro ao fazer a requisição:', err);
      setError('Ocorreu um erro ao buscar a predição. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Analisador de Moléculas</Text>
      <TextInput
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
        placeholder="Digite a string SMILES aqui"
        value={smiles}
        onChangeText={setSmiles}
      />
      <Button title="Analisar Molécula" onPress={handlePredict} disabled={loading} />
      
      {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}
      
      {error && <Text style={{ color: 'red', marginTop: 20 }}>{error}</Text>}

      {prediction && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontWeight: 'bold' }}>Resultado da Predição (Vetor):</Text>
          <Text>{JSON.stringify(prediction, null, 2)}</Text>
        </View>
      )}
    </View>
  );
}

export default Predictor;