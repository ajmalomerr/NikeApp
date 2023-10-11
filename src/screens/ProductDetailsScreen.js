import {
    StyleSheet,
    View,
    Image,
    FlatList,
    useWindowDimensions,
    Text,
    ScrollView,
    Pressable,
    Alert,
    ActivityIndicator,
    Animated,
    Easing,
} from 'react-native';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cartSlice } from '../store/cartSlice';
import { useGetProductQuery } from '../store/apisLice';
const { width } = useWindowDimensions();

const ProductDetailsScreen = ({ navigation, route }) => {

    useEffect(() => {
        navigation.setOptions({ title: 'Product Details', headerShown: true, headerMode: "float", })
    }, []);

    const animatedValue = new Animated.Value(0);
    const [isSelected, setSelected] = useState(null)
    const [selectedSize, setSelectedSize] = useState()
    const [isPressed, setPressed] = useState(false)

    const dispatch = useDispatch()

    const { data, isLoading, error } = useGetProductQuery(route.params.id);

    if (isLoading) {
        return <View style={styles.loader}><ActivityIndicator color={'blue'} size={"large"} /></View>
    }

    if (error) {
        return <View style={styles.loader}><Text>error fetching products : {error?.error}</Text></View>
    }

    const product = data?.data;

    const addToCart = () => {
        if (selectedSize) {
            dispatch(cartSlice.actions.addCartItem({
                product: {
                    ...product,
                    sizes: selectedSize
                },
            }));
            setPressed(false)
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

            <Pressable onPress={() => addToCart()} style={styles.button}>
                <Text style={styles.buttonText}>Add to cart</Text>
            </Pressable>
        </View>
    );
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
        paddingBottom: 70
    },
    size: {
        fontSize: 14,
        fontWeight: '300',
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
    }
});

export default ProductDetailsScreen;