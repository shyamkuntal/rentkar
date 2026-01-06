import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';
import AuthStack from './AuthStack';
import AppTabs from './AppTabs';
import { AuthContext } from '../context/AuthContext';

const RootNavigator = () => {
  const { isLoading, userToken } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userToken !== null ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default RootNavigator;
