import ProductsScreen from '../screens/ProductsScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import ShoppingCart from '../screens/ShoppingCart';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import { selectedCartItems } from '../store/cartSlice';
import Orders from '../screens/Orders';
import favouriteList from '../screens/favouriteList';
import FavouriteList from '../screens/favouriteList';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
    const numberOfCartItems = useSelector(selectedCartItems)
    return (
        <Stack.Navigator
            screenOptions={{ contentStyle: { backgroundColor: "#fff" } }}
            initialRouteName="ProductsScreen">
            <Stack.Screen name="ProductsScreen" component={ProductsScreen}
                options={({ navigation }) => ({
                    headerTitle: '',
                    headerLeft: () => (
                        <Text style={{ marginLeft: 5, fontWeight: '500', fontSize: 18 }}>{"Products"}</Text>
                    ),
                    headerRight: () => (
                        <View style={{ flexDirection: "row" }}>
                            <Pressable
                                onPress={() => navigation.navigate('FavouriteList')}
                                style={{ marginHorizontal: 10 }}
                            >
                                <Feather name="heart" size={21} color="gray" />
                            </Pressable>
                            <Pressable
                                onPress={() => navigation.navigate('Orders')}
                                style={{ marginHorizontal: 10 }}
                            >
                                <Feather name="package" size={21} color="gray" />
                            </Pressable>
                            <Pressable
                                onPress={() => navigation.navigate('ShoppingCart')}
                                style={{ flexDirection: 'row' }}
                            >
                                <Icon name="shopping-cart" size={18} color="gray" />
                                <Text style={{ marginLeft: 5, fontWeight: '500' }}>{numberOfCartItems}</Text>
                            </Pressable>
                        </View>
                    ),
                })}

            />
            <Stack.Screen name="ProductDetailsScreen" component={ProductDetailsScreen} options={{ headerShown: true, }} />
            <Stack.Screen name="ShoppingCart" component={ShoppingCart} options={{ title: "Cart", }} />
            <Stack.Screen name="Orders" component={Orders} options={{ title: "Orders", }} />
            <Stack.Screen name="FavouriteList" component={FavouriteList} options={{ title: "WISHLIST", }} />
        </Stack.Navigator>
    );
}

export { StackNavigator };