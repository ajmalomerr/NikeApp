import { Text, FlatList, View, StyleSheet, Pressable, Alert, ActivityIndicator } from 'react-native';
// import cart from '../data/cart';
import CartListItem from '../components/CartListItem';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cartSlice, creatOrders, selectDeliveryPrice, selectSubTotal, selectedCartItems, selectedTotalPrice } from '../store/cartSlice';
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
    const subtotal = useSelector(selectSubTotal)
    const numberOfCartItems = useSelector(selectedCartItems)
    const delievryPrice = useSelector(selectDeliveryPrice)
    const totalPrice = useSelector(selectedTotalPrice)
    const dispatch = useDispatch()

    const cart = useSelector((state) => state.cart.item);

    // const [createOrder, { data, isLoading, error }] = useCreateOrderMutation();
    const { createOrderStatus, loader } = useSelector((state) => state?.cart);

    const onCreateOrder = async () => {
        let items = [];

        cart?.map((item) => {
            items.push(item?.product)
        });

        const result = {
            products: items,
            subtotal,
            delievryPrice,
            totalPrice,
            customer: {
                name: "Ajmal kp",
                address: "My home",
                email: "ajmal@gmail.com"
            },

        };

        dispatch(creatOrders(result))
        console.log("submitted", JSON.stringify(await createOrderStatus))


    }

    if (createOrderStatus == "1000") {
        dispatch(cartSlice.actions.clearCart())
        Alert.alert( "Order has been placed successfully" );
        navigation.popToTop()
    }

    // if (loader) {
    //     return <View style={styles.loader}><ActivityIndicator color={'blue'} size={"large"} /></View>
    // }

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
                <Pressable onPress={() => onCreateOrder()} style={styles.button}>
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