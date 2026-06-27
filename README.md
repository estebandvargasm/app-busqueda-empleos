# App Búsqueda de Empleos

App de búsqueda de empleos remotos consumiendo la API pública de [Remotive](https://remotive.com/api/remote-jobs).

## Stack

- **Expo SDK 52** con Expo Router (navegación basada en archivos)
- **React Native 0.76** + TypeScript
- **Zustand 5** para estado global con persistencia en AsyncStorage
- **Axios** como cliente HTTP

## Requisitos

- Node.js >= 18
- npm o yarn

## Instalación

```bash
npm install
```

## Ejecutar

```bash
npx expo start
```

Esto abre el servidor de desarrollo. Desde ahí puedes:

- Presionar `a` para abrir en Android Emulator
- Presionar `i` para abrir en iOS Simulator
- Presionar `w` para abrir en navegador web
- Escanear el QR con Expo Go en tu dispositivo

## Funcionalidades

- Listado de empleos remotos con búsqueda por texto, filtro por categoría y tipo de trabajo
- Pantalla de detalle con descripción completa, salario, y botón para aplicar
- Favoritos con persistencia local (AsyncStorage)
- Pull-to-refresh en el listado
- Compartir empleo vía share sheet nativo
