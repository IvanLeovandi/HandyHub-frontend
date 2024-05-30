import React, { useState } from 'react';
import { View, ScrollView, Image, StyleSheet, Dimensions, Pressable, GestureResponderEvent } from 'react-native';
import { Text, Button, Avatar, Card, IconButton, Portal, Modal, TextInput, PaperProvider } from 'react-native-paper';
import Swiper from 'react-native-swiper';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MenuStackParams } from '..';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Rating } from 'react-native-ratings';

const { width: screenWidth } = Dimensions.get('window');

interface CarouselItem {
  title: string;
  uri: string;
}

interface Review {
  id: string
  userId: string,
  name: string,
  review: string,
  rating: number,
}

interface ReviewArray extends Array<Review>{};

type Props = NativeStackScreenProps<MenuStackParams, "Detail">

export type serviceDetail = {
  _id: string,
  images: [string]
  name: string,
  price: number,
  description: string,
  city: string,
  provider: {
    _id: string,
    name: string,
  },
  category: {
    name: string,
  },
  specialty: string,
  jobs: number,
}

interface userProfile {
  id: string
  username: string;
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
}

const DetailPlaceholder = require("@/assets/images/Bob.png")

const Detail : React.FC<Props>= ({route}) => {
  const entries: CarouselItem[] = [
    { title: 'Image 1', uri: DetailPlaceholder },
    { title: 'Image 2', uri: DetailPlaceholder },
    { title: 'Image 3', uri: DetailPlaceholder },
    { title: 'Image 4', uri: DetailPlaceholder },
  ];  

  const [loading, setLoading] = useState(true);
  const [service,setService] = React.useState<serviceDetail>({
    _id: "", images: [""], name: "", price:0, description: "", city: "", provider:{_id:"", name:""}, category: {name:""}, specialty:"",jobs:0,
  });
  const [isFavorite, setIsFavorite] = useState(route.params.isFavourite || false);
  const [modalVisible, setModalVisible] = useState(false);
  const [rating, setRating] = useState(0); //buat submit
  const [comment, setComment] = useState(""); //buat submit
  const [userReview, setUserReview] = useState<ReviewArray>([]);
  const [isSubmit, setIsSubmit] = useState(false)
  const [isDeleted, setIsDeleted] = useState(false)
  const [user, setUser] = useState<userProfile>({username:"",name:"",phoneNumber:"",email:"",address:"",id:""})  
  const router = useRouter()
  
  async function getServiceDetail() {    

    const response = await fetch(`http://192.168.1.13:8000/service/${route.params.id}`);
    const reviewResponse = await fetch(`http://192.168.1.13:8000/review/${route.params.id}`);
    const result = await response.json();
    const reviewResult = await reviewResponse.json();
    setService(result.service);
    setUserReview(reviewResult.review);
    setLoading(false)
  }
  

  React.useEffect(() => {
    getServiceDetail();
    getProfile()
  }, [isFavorite, isSubmit, isDeleted])  
    
  const favouriteHandler = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        //redirect ke login
        router.push("Menu/login")
      }

      if (!isFavorite) {
        const response = await fetch(`http://192.168.1.13:8000/favorite/${route.params.id}`, {
          method: "POST",
          body: JSON.stringify({
            isFavorite: isFavorite
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
          }
        })
        if (response.ok!) {
          setIsFavorite(true)
        }
      }
      if (isFavorite) {
        const response = await fetch(`http://192.168.1.13:8000/favorite/${route.params.id}`, {method: "DELETE", headers: {Authorization: "Bearer " + token}})
        setIsFavorite(false) 
      }
      return; 
    } catch (error) {
      console.log(error);
    }
  }  

  const modalHandler = async (event: GestureResponderEvent) => {
    event.preventDefault()
    try {
    const token = await AsyncStorage.getItem("token");
      if (!token) {
        //redirect ke login
        router.push("Menu/login")
      }
    } catch (err) {
      console.log(err)
    }
  }

  const addReviewHandler = async (event: GestureResponderEvent) => {
    event.preventDefault();
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        //redirect ke login
        router.push("Menu/login")
      }
      const response = await fetch(`http://192.168.1.13:8000/review/${route.params.id}`, {
          method: "POST",
          body: JSON.stringify({
            rating: rating,
            review: comment
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
          }
        });
      if (response.status === 422) {
          throw new Error()
      }

      if (response.status !== 200 && response.status !== 201) {
          throw new Error()
      }

      const result = await response.json()
      setModalVisible(false)
      setIsSubmit(!isSubmit)
    } catch (err) {
      console.log(err)
    }
  }

  const deleteHandler = async (id: string) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`http://192.168.1.13:8000/review/${id}`, {method: "DELETE", headers: {Authorization: "Bearer " + token}});
      if (!response.ok) {
        throw new Error();
      }
      const result = await response.json();
      setIsDeleted(!isDeleted)
    } catch (error) {
      console.log(error);
    }
  }

  async function getProfile() {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      return;
    }
    
    const response = await fetch("http://192.168.1.13:8000/profile", {
        headers: {
          Authorization : `Bearer ${token}`,
        },
    });
    const result = await response.json();
    setUser(result.user);
    setLoading(false)
  }

  const navigation : any = useNavigation();
  return (
    <PaperProvider>
    <View>
    {!loading ? 
    <ScrollView contentContainerStyle={styles.container}>
        <Swiper
        style={styles.wrapper}
        showsButtons
        autoplay
        loop
      >
        {service.images.map((item, index) => {
          return (
          <View key={index} style={styles.carouselItem}>
            <Image src={`http://192.168.1.13:8000/images/${item}`} style={styles.carouselImage} />
          </View>
          )
        }
        )}
      </Swiper>
      <View style={styles.profileSection}>
        <View style={styles.header}>
          <Text style={styles.profileName}>{service.name}</Text>
          <IconButton
            icon={isFavorite ? "heart" : "heart-outline"}
            iconColor={isFavorite ? "red" : "black"}
            size={24}
            onPress={favouriteHandler}
          />
        </View>
        <Text style={styles.profileDetails}>Provider: <Text style={{fontWeight: "bold", color: "#027361"}}>{service.provider.name}</Text></Text>
        <Text style={styles.profileDetails}>Category: {service.category.name} </Text>
        <Text style={styles.profileDetails}>Job: {service.specialty}</Text>
        <Text style={styles.profileDetails}>Rate: {service.price}</Text>
        <Text style={styles.profileDescription}>
          {service.description}
        </Text>
      </View>
      <View style={styles.reviewSection}>
        <View style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: "row" }}>
          <Text style={styles.reviewTitle}>Reviews:</Text>
          {user.id !== service.provider._id && (
          <Button mode='contained' buttonColor='#027361' onPress={modalHandler}>
            <Text style={{ color: "white" }}>Write a Review</Text>
            </Button>
          )}
        </View>
        <Pressable style={styles.viewAllText}>
          <Text style={{color: "#027361"}}>View All</Text>
        </Pressable>
        {userReview?.map((review) => (
          <Card style={styles.reviewCard}>
            <Card.Title
              title={review.name}
              subtitle={review.review}
              left={(props) => <Avatar.Icon {...props} icon="star" />}
              />
            <Card.Content>
              {user.id === review.userId  && (
                <Button mode='contained' buttonColor='red' onPress={() => deleteHandler(review.id)}><Text style={{color: "white"}}>Delete Review</Text></Button>
              )
              }
            </Card.Content>
          </Card>
        )
        )}
      </View>
      <View style={styles.buttonContainer}>
        {/* <Button mode="contained" style={styles.chatButton} onPress={() => {}}>Chat</Button> */}
        {user.id !== service.provider._id &&(
          <Button mode="contained" style={styles.bookButton} onPress={() => {
            navigation.push("MenuStack", {screen: "Order", params:{service}})
          }}>Book</Button>)
        }
      </View>
    </ScrollView>
      : 
      <Text>Loading...</Text>
      } 
    </View>
    <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContainer}>
          <Text style={styles.modalTitle}>Write a Review</Text>
          <Rating
            showRating
            onFinishRating={setRating}
            style={{ paddingVertical: 10 }}
          />
          <TextInput
            label="Comment"
            onChangeText={setComment}
            mode="outlined"
            multiline
            style={styles.commentInput}
          />
          <Button mode="contained" onPress={addReviewHandler} style={styles.submitButton}>
            Submit Review
          </Button>
        </Modal>
      </Portal>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerRightIcons: {
    flexDirection: 'row',
  },
  wrapper: {
    height: 400,
  },
  carouselItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselImage: {
    width: screenWidth * 0.8,
    height: 400,
    objectFit: "contain"
  },
  carouselTitle: {
    marginTop: 8,
    fontSize: 16,
    textAlign: 'center',
  },
  profileSection: {
    marginVertical: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black'
  },
  profileDetails: {
    fontSize: 16,
    marginVertical: 2,
    color: "black"
  },
  profileDescription: {
    fontSize: 16,
    marginVertical: 8,
    color: "black"
  },
  reviewSection: {
    marginVertical: 16,
  },
  reviewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "#027361"
  },
  viewAllText: {
    fontSize: 16,
    color: '#0000FF',
    alignSelf: 'flex-end',
    marginTop: 24,
  },
  reviewCard: {
    marginVertical: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  chatButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#027361',
  },
  bookButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#027361',
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  commentInput: {
    height: 100,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#027361',
  },
});

export default Detail;
