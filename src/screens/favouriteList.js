import { StyleSheet, Text, View, FlatList, Image, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishList } from '../store/wishListSlice';

const FavouriteList = () => {

    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state?.wishlist);

    useEffect(() => {
        dispatch(fetchWishList())
    }, []);

    if (loading) {
        return <View style={styles.loader}><ActivityIndicator color={'blue'} size={"large"} /></View>
    }

    if (error) {
        return <View style={styles.loader}><Text>error fetching products : {error?.error}</Text></View>
    }

    const renderItem = ({ item }) => (
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
            <View style={styles.moveCrtBtn}>
                <View style={styles.moveCrtTxt}>
                    <Text style={styles.cartTxt}> {"MOVE TO CART"}</Text>
                </View>
            </View>
        </View>
    );


    return (
        <View>
            <FlatList
                data={products}
                renderItem={renderItem}
                numColumns={2}
            />
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
    }
});