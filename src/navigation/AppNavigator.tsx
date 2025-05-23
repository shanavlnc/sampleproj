import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/user/HomeScreen';
import PetDetailScreen from '../screens/user/PetDetailsScreen';
import SavedScreen from '../screens/user/SavedScreen';
import AdminDashboard from '../screens/admin/AdminDashboard';
import ManagePetsScreen from '../screens/admin/ManagePetsScreen';
import ApplicationsScreen from '../screens/admin/ApplicationsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const UserTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName: IoniconName = 'help-outline';
        
        if (route.name === 'Home') iconName = 'paw-outline';
        if (route.name === 'Saved') iconName = 'heart-outline';

        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Saved" component={SavedScreen} />
  </Tab.Navigator>
);

const AdminStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
    <Stack.Screen name="ManagePets" component={ManagePetsScreen} />
    <Stack.Screen name="Applications" component={ApplicationsScreen} />
  </Stack.Navigator>
);

export default function AppNavigator() {
  const { user } = useAuth();

  return (
    <Stack.Navigator>
      {!user ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : user.role === 'admin' ? (
        <Stack.Screen 
          name="Admin" 
          component={AdminStack} 
          options={{ headerShown: false }} 
        />
      ) : (
        <Stack.Screen 
          name="User" 
          component={UserTabs} 
          options={{ headerShown: false }} 
        />
      )}
      <Stack.Screen name="PetDetail" component={PetDetailScreen} />
    </Stack.Navigator>
  );
}