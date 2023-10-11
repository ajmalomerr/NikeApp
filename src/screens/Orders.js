import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { useGetOrdersQuery } from '../store/apisLice';

const Orders = () => {

    const { data, isLoading, error } = useGetOrdersQuery();

    if (isLoading) {
        return <View style={styles.loader}><ActivityIndicator color={'blue'} size={"large"} /></View>
    }

    if (error) {
        return <View style={styles.loader}><Text>error fetching products : {error?.error}</Text></View>
    }

    const orders = data?.data

    return (
        <View style={styles.container}>
            {orders?.map((item, i) => {

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
        </View>
    )
}

export default Orders

const styles = StyleSheet.create({
    container: {
        flex: 1,
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