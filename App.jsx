import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, Platform } from 'react-native';

// 1. Importe o componente Predictor que você já tem
import Predictor from './predictor.jsx'; // Verifique se o nome do arquivo está correto

export default function App() {
  return (
    // SafeAreaView é uma boa prática para evitar que o conteúdo fique atrás do notch do celular
    <SafeAreaView style={styles.container}>
      
      {/* 2. Renderize o seu componente principal aqui */}
      <Predictor />

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // Adicionando padding para Android para um efeito similar ao SafeAreaView do iOS
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
});