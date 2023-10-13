import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react';
import { useGetOrdersQuery } from '../store/apisLice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../store/cartSlice';

const Orders = () => {
    const dispatch = useDispatch();
    const { allOrders, loader, error } = useSelector((state) => state.cart)

    useEffect(() => {
        dispatch(fetchOrders())
    }, []);

    if (loader) {
        return <View style={styles.loader}><ActivityIndicator color={'blue'} size={"large"} /></View>
    }

    if (error) {
        return <View style={styles.loader}><Text>error fetching products : {error}</Text></View>
    }

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            {allOrders?.map((item, i) => {

                return (
                    <View
                        key={i}
                        style={{ backgroundColor: "#f6f6f6", margin: 10 }}
                    >
                        <View style={{ flexDirection: "row" }}>
                            <Image source={{ uri: item?.image }} style={styles.image} />
                            <View style={{ flexDirection: "column", justifyContent: "center", padding: 10, }}>
                                <Text style={{ color: "green" }}>Order on {item?.orderOn}</Text>
                                <Text style={{ color: "grey" }}>{item?.name}</Text>
                                <Text style={{ color: "grey" }}>Size : {item?.size}</Text>
                            </View>
                        </View>
                    </View>
                )
            })}
        </ScrollView>
    )
}

export default Orders

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // backgroundColor: "#EAEAEA"
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    image: {
        width: "25%",
        aspectRatio: 1,
    },
});