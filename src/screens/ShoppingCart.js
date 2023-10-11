import { Text, FlatList, View, StyleSheet, Pressable, Alert } from 'react-native';
// import cart from '../data/cart';
import CartListItem from '../components/CartListItem';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cartSlice, selectDeliveryPrice, selectSubTotal, selectedCartItems, selectedTotalPrice } from '../store/cartSlice';
import { useCreateOrderMutation } from '../store/apisLice';

const ShoppingCartTotals = () => {
    const Subtotal = useSelector(selectSubTotal)
    const numberOfCartItems = useSelector(selectedCartItems)
    const delievryPrice = useSelector(selectDeliveryPrice)
    const totalPrice = useSelector(selectedTotalPrice)

    return (
        <View>
            {numberOfCartItems != 0 ?
                <View style={styles.totalsContainer}>
                    <View style={styles.row}>
                        <Text style={styles.text}>Subtotal</Text>
                        <Text style={styles.text}>{Subtotal} US$</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>Delivery</Text>
                        <Text style={styles.text}>{delievryPrice} US$</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.textBold}>Total</Text>
                        <Text style={styles.textBold}>{totalPrice} US$</Text>
                    </View>
                </View> : null
            }
        </View>
    )
};

const ShoppingCart = ({ navigation }) => {
    const Subtotal = useSelector(selectSubTotal)
    const numberOfCartItems = useSelector(selectedCartItems)
    const delievryPrice = useSelector(selectDeliveryPrice)
    const totalPrice = useSelector(selectedTotalPrice)
    const currentDate = new Date();
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    const formattedDate = currentDate.toLocaleDateString(undefined, options);


    // useEffect(() => {
    //     navigation.setOptions({ title: 'Cart', headerShown: true, headerMode: "float", })
    // }, []);

    const dispatch = useDispatch()

    const cart = useSelector((state) => state.cart.item);

    const [createOrder, { data, isLoading, error }] = useCreateOrderMutation();

    const onCreateOrder = async () => {
        const result = await createOrder({
            items: cart,
            Subtotal,
            delievryPrice,
            totalPrice,
            customer: {
                name: "Ajmal kp",
                address: "My home",
                email: "ajmal@gmail.com"
            },
            orderOn: formattedDate
        });
        
        if (result?.data?.status == "1000") {
            Alert.alert(
                "Order has been submitted",
                `Your order reference is : ${result?.data?.data?.ref}`
            );
            navigation?.goBack()
            dispatch(cartSlice.actions.clearCart())
        }

    }

    return (
        <>
            {numberOfCartItems == 0 && <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
                <Text>You'r cart is empty</Text>
            </View>}
            <FlatList
                data={cart}
                renderItem={({ item }) => <CartListItem cartItem={item} />}
                ListFooterComponent={ShoppingCartTotals}
            />
            {numberOfCartItems != 0 ?
                <Pressable onPress={onCreateOrder} style={styles.button}>
                    <Text style={styles.buttonText}>Checkout</Text>
                </Pressable> : null}

        </>
    );
};

const styles = StyleSheet.create({
    totalsContainer: {
        margin: 20,
        paddingTop: 10,
        borderColor: 'gainsboro',
        borderTopWidth: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 2,
    },
    text: {
        fontSize: 16,
        color: 'gray',
    },
    textBold: {
        fontSize: 16,
        fontWeight: '500',
    },

    button: {
        position: 'absolute',
        backgroundColor: 'black',
        bottom: 30,
        width: '90%',
        alignSelf: 'center',
        padding: 20,
        borderRadius: 100,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 16,
    },
});

export default ShoppingCart;