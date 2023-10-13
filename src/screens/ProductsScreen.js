import { StyleSheet, Text, View, Image, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, productsSlice } from '../store/productSlice';
import { useGetProductsQuery } from '../store/apisLice';

const ProductsScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state?.products);


    useEffect(() => {
        dispatch(fetchProducts());
    }, []);

    if (loading) {
        return <View style={styles.loader}><ActivityIndicator color={'blue'} size={"large"} /></View>
    }

    if (error) {
        return <View style={styles.loader}><Text>error fetching products : {error?.error}</Text></View>
    }

    return (
        <FlatList
            data={products}
            renderItem={({ item }) => (
                <Pressable
                    onPress={() => {
                        // dispatch(productsSlice.actions.setSelectedProducts(item?.id))
                        navigation?.navigate("ProductDetailsScreen", { id: item?._id })
                    }}
                    style={styles.itemContainer}>
                    <Image source={{ uri: item.image }} style={styles.image} />
                </Pressable>
            )}
            numColumns={2}
        />
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        width: '50%',
        padding: 1,
    },
    image: {
        width: '100%',
        aspectRatio: 1,
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});

export default ProductsScreen;