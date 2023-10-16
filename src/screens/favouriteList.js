import { StyleSheet, Text, View, FlatList, Image, ActivityIndicator, Dimensions, Animated, Pressable, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishList, removeFromFavourite } from '../store/wishListSlice';
import Modal from 'react-native-modal';
import { cartSlice } from '../store/cartSlice';

width = Dimensions.get('window').width;


const FavouriteList = () => {

    const [visible, setVisible] = useState(false)
    const [selectedSize, setSelectedSize] = useState()
    const [selectedItem, setSelectedItem] = useState(null)

    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state?.wishlist);

    useEffect(() => {
        dispatch(fetchWishList())
    }, []);

    if (loading) {
        return <View style={styles.loader}><ActivityIndicator color={'blue'} size={"large"} /></View>
    }

    if (error) {
        return <View style={styles.loader}><Text>error fetching products : {error}</Text></View>
    }

    const handlePress = (item) => {
        setSelectedSize(item)
    }



    const renderItem = ({ item }) => {

        return (
            <View style={styles.item}>
                <Image
                    source={{ uri: item.image }}
                    style={styles.imageStyle}
                />
                <View style={styles.detailContainer}>
                    <Text numberOfLines={1} style={{ color: "grey" }}>{item?.name}</Text>
                    <View style={styles.priceStyle}>
                        <FontAwesome name="rupee" size={13} color="#000" />
                        <Text style={{ fontSize: 13 }}> {item?.price}</Text>
                    </View>
                </View>
                <Pressable
                    onPress={() => { setSelectedItem(item), setVisible(true) }}
                    style={styles.moveCrtBtn}>
                    <View style={styles.moveCrtTxt}>
                        <Text style={styles.cartTxt}> {"MOVE TO CART"}</Text>
                    </View>
                </Pressable>
            </View>
        )
    }

    const addToCart = async (newData) => {
        if (selectedSize) {
            await dispatch(removeFromFavourite(newData?._id))
            dispatch(cartSlice.actions.addCartItem(
                {
                    product: {
                        ...newData,
                        sizes: selectedSize,
                        quantity: 1
                    },
                }
            ));
            setVisible(false);
        }
    };

    return (
        <View>
            <FlatList
                data={products}
                renderItem={(item) => renderItem(item)}
                numColumns={2}
            />
            {visible &&
                <Modal
                    backdropOpacity={0.4}
                    onBackdropPress={() => { setVisible(false), setSelectedSize("") }}
                    style={{ justifyContent: "flex-end", margin: 0, }}
                    isVisible={visible}>
                    <View style={[styles.modalStyle, selectedSize ? { height: "18%" } : { height: "15%", }]}>
                        <View style={{ padding: 20 }}>
                            {selectedSize ? <Text>Size : {selectedSize}</Text> : <Text>select size</Text>}
                            <View style={{ flexDirection: "row", }}>
                                {selectedItem?.sizes?.map((data, index) => {
                                    return (
                                        <Pressable key={index}
                                            onPress={() => handlePress(data, index)}
                                            style={
                                                [
                                                    styles.sizeContainer,
                                                    index == "0" ? null : { marginHorizontal: 5 },
                                                    data == selectedSize ? { backgroundColor: "#000" } : null
                                                ]
                                            }>
                                            <Text style={[selectedSize == data ? { color: "white" } : { color: "#000" }]}>{data}</Text>
                                        </Pressable>
                                    )
                                })}
                            </View>
                            {selectedItem && selectedSize ?
                                <Pressable
                                    onPress={() => addToCart(selectedItem)}
                                    style={styles.doneBtn}
                                >
                                    <Text style={styles.doneTxt}>Done</Text>
                                </Pressable> : null}
                        </View>
                    </View>
                </Modal>}
        </View>
    )
}

export default FavouriteList

const styles = StyleSheet.create({
    item: {
        flex: 1,
        margin: 10,
        padding: 10,
        // backgroundColor: '#f0f0f0', // Adjust styling as needed
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    imageStyle: {
        aspectRatio: 1,
        height: 150,
        resizeMode: 'cover',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    detailContainer: {
        width: 150,
        borderWidth: 1,
        borderColor: "#f6f6f6",
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    priceStyle: {
        flexDirection: "row",
        alignItems: "center"
    },
    moveCrtBtn: {
        width: 150,
        borderWidth: 1,
        borderColor: "#f6f6f6",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    moveCrtTxt: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    cartTxt: {
        fontSize: 13,
        color: "#ed3c67"
    },
    modalStyle: {
        backgroundColor: "white",
        width: "100%",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
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
    doneBtn: {
        height: 33,
        backgroundColor: "#ed3c67",
        marginVertical: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    doneTxt: {
        color: "#fff",
        fontSize: 19,
        fontWeight: "600"
    }
});