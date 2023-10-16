import {
    StyleSheet,
    View,
    Image,
    FlatList,
    Text,
    ScrollView,
    Pressable,
    Alert,
    ActivityIndicator,
    Animated,
    Dimensions
} from 'react-native';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cartSlice } from '../store/cartSlice';
import { useGetProductQuery } from '../store/apisLice';
import { addToFavourite, fetchProductDetails } from '../store/productSlice';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
width = Dimensions.get('window').width;


const ProductDetailsScreen = ({ navigation, route }) => {
    const dispatch = useDispatch()
    const { productDetails, isFav, fecthLoader, error } = useSelector((state) => state?.products);

    const animatedValue = new Animated.Value(0);
    const [isSelected, setSelected] = useState(null)
    const [selectedSize, setSelectedSize] = useState()
    const [isPressed, setPressed] = useState(false)
    const [addedTocart, setAdeddTocart] = useState(false)

    useEffect(() => {
        navigation.setOptions({ title: 'Product Details', headerShown: true, headerMode: "float", })
        dispatch(fetchProductDetails(route.params.id))
    }, []);

    // const { data, isLoading, error } = useGetProductQuery(route.params.id);

    if (error) {
        return <View style={styles.loader}><Text>error fetching products : {error}</Text></View>
    }

    const product = productDetails;

    const addToCart = () => {
        if (selectedSize) {
            dispatch(cartSlice.actions.addCartItem({
                product: {
                    ...product,
                    sizes: selectedSize,
                    quantity: 1
                },
            }));
            setPressed(false)
            setAdeddTocart(true)
        } else {
            shakeAnimation()
            setTimeout(() => {
                setPressed(true)
            }, 200)
        }
    };

    const shakeAnimation = () => {
        Animated.sequence([
            Animated.timing(animatedValue, { toValue: 2, duration: 50, useNativeDriver: true }),
            Animated.timing(animatedValue, { toValue: -2, duration: 50, useNativeDriver: true }),
            Animated.timing(animatedValue, { toValue: 1, duration: 50, useNativeDriver: true }),
            Animated.timing(animatedValue, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]).start();
    };

    const handlePress = (item, index) => {
        setSelectedSize(item)
        setSelected(index)
        setPressed(false)
    }

    const onPress = () => {
        let req = {
            favourite: !isFav
        }
        dispatch(addToFavourite({ id: route.params.id, req }))
    }

    const renderUi = () => {
        return (
            <View>
                <ScrollView>
                    <FlatList
                        data={product?.images}
                        renderItem={({ item }) => (
                            <Image source={{ uri: item }} style={{ width, aspectRatio: 1 }} />
                        )}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        pagingEnabled
                    />
                    <View style={{ padding: 20 }}>
                        <Text style={styles.title}>{product?.name}</Text>
                        <Text style={styles.price}>${product?.price}</Text>
                        <View style={{ flexDirection: "row" }}>
                            {product?.sizes?.map((item, index) => {
                                return (
                                    <Animated.View
                                        style={[
                                            {
                                                transform: [
                                                    {
                                                        translateY: animatedValue.interpolate({
                                                            inputRange: [-1, 1],
                                                            outputRange: [-3, 3],
                                                        }),
                                                    },
                                                ],
                                            }
                                        ]}
                                        key={index}>
                                        <Pressable
                                            onPress={() => handlePress(item, index)}
                                            style={[
                                                styles.sizeContainer,
                                                isPressed ? { borderColor: "red" } : null,
                                                index == "0" ? null : { marginHorizontal: 5 },
                                                isSelected == index ? { backgroundColor: "#000" } : null
                                            ]}>
                                            <Text style={[
                                                styles.size,
                                                isSelected == index ? { color: "white" } : { color: "#000" }
                                            ]}>{item}</Text>
                                        </Pressable>
                                    </Animated.View>
                                )
                            })}
                        </View>
                        <Text style={styles.description}>{product?.description}</Text>
                    </View>
                </ScrollView>
                <View style={styles.button}>
                    <Pressable
                        onPress={() => onPress()}
                        style={styles.wishBtn}>
                        {!isFav ?
                            <Feather name="heart" size={18} color="#000" />
                            : <AntDesign name="heart" size={18} color="#ed3c67" />
                        }
                        <Text style={styles.wishButtonText}>  WISHLIST</Text>
                    </Pressable>
                    {addedTocart ?
                        <Pressable
                            onPress={() => navigation.navigate('ShoppingCart', { isFromDetails: true })}
                            style={styles.addCrtBtn}>
                            <Feather name="shopping-bag" size={18} color="#fff" />
                            <Text style={styles.buttonText}>   GO TO CART</Text>
                        </Pressable> :
                        <Pressable
                            onPress={() => addToCart()}
                            style={styles.addCrtBtn}>
                            <Feather name="shopping-bag" size={18} color="#fff" />
                            <Text style={styles.buttonText}>   ADD TO CART</Text>
                        </Pressable>
                    }
                </View>
            </View>
        );
    }

    return (
        <>{fecthLoader ? <View style={styles.loader}><ActivityIndicator color={'blue'} size={"large"} /></View> : renderUi()}</>
    )

};

const styles = StyleSheet.create({
    title: {
        fontSize: 34,
        fontWeight: '500',
        marginVertical: 10,
    },
    price: {
        fontWeight: '500',
        fontSize: 16,
        letterSpacing: 1.5,
    },
    description: {
        marginVertical: 10,
        fontSize: 18,
        lineHeight: 30,
        fontWeight: '300',
        paddingBottom: 70,
        fontFamily: 'poppins-regular',
    },
    size: {
        fontSize: 14,
        fontWeight: '300',
    },
    button: {
        position: 'absolute',
        backgroundColor: '#fff',
        bottom: 0,
        width: width,
        alignSelf: 'center',
        paddingHorizontal: 20,
        paddingBottom: 25,
        alignItems: 'center',
        flexDirection: "row",
        justifyContent: "space-between"
    },
    buttonText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 16,
    },
    wishButtonText: {
        color: 'black',
        fontWeight: '500',
        fontSize: 16,
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    sizeContainer: {
        height: 30,
        width: 30,
        borderRadius: 50,
        borderWidth: 1,
        marginTop: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    wishBtn: {
        height: 40,
        width: "45%",
        borderWidth: 1,
        borderRadius: 6,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    addCrtBtn: {
        height: 40,
        width: "45%",
        backgroundColor: "#ed3c67",
        borderRadius: 6,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    }
});

export default ProductDetailsScreen;