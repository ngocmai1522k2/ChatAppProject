import React, { useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import auth from "@react-native-firebase/auth"
import { useNavigation } from "@react-navigation/native";
import { getApiNoneToken } from "../../api/CallApi";

export default function ForgotPassScreen(){
    const [phoneNumber,setPhoneNumber] = useState('')
    const [code,setCode] = useState('')
    const [confirm,setConfirm] = useState('')
    const [id,setId] =useState("")
    const navigation = useNavigation();

    const signInWithPhoneNumber = async()=>{
        try{
            
               // const sdt = "0345641602"
      // const findUserByPhone = await getApiNoneToken("/getDetailsByPhone/"+sdt)
      const findUserByPhone = await getApiNoneToken("/getDetailsByPhone/"+phoneNumber)
       
              
            
        setId(findUserByPhone.data.data._id)
        console.log(id)
        const confirmmation = await auth().signInWithPhoneNumber(phoneNumber);
        setConfirm(confirmmation);
        }catch(error){
            alert("số điện thoại không tồn tại")
            console.log("Error sending code",error)
        }
    };
    const confirmcode = async()=>{
        try{
            const userCredential = await confirm.confirm(code);
            const user = userCredential.user;
            // check if user is new or existing

            if(user!=null){
                navigation.navigate("NewPasswordScreen",{id:id})
            }
          
          
          
        }catch(error){
           Alert.alert("Thông Báo","Số điện thoại không hợp lệ!")
            console.log("invalid code",error)
        }
        
    }
    return(
        <View style={{flex:1,padding:10,backgroundColor:"#BEBDB8"}}>
            <Text style={{fontSize:32,
            fontWeight:'bold',
            marginBottom:40,
            marginTop:150
            
            }}>
                Forgot Password?
            </Text>

            {!confirm?(
                    <>
                    <Text style={{marginBottom:20,fontSize:18}}>
                        enter your phone number
                    </Text>
                    <TextInput style={{height:50,width:'100%',borderColor:"black",
                        borderWidth:1,marginBottom:30, paddingHorizontal:10,
                }} placeholder="e.g.,+ 843465798"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                />

                <TouchableOpacity onPress={signInWithPhoneNumber} style={{backgroundColor:"#841584",
                padding:10,borderRadius:5,marginBottom:20,alignItems:"cener"

            }}>
                <Text style={{color:'white',fontSize:22,fontWeight:"bold"}}>send code</Text>


                </TouchableOpacity>
                </>

            ):(
                <>
                    <Text style={{marginBottom:20,fontSize:18
                    }}>
                        enter the code sent to your phone

                    </Text>

                    <TextInput style={{height:50,width:"100%",borderColor:"black",borderWidth:1,marginBottom:30
                    ,paddingHorizontal:10
                    }} placeholder="enter code" value={code} onChangeText={setCode}/>

                    <TouchableOpacity onPress={confirmcode} style={{
                        backgroundColor:"#841584",
                        padding:10,
                        borderRadius:5,
                        marginBottom:20,
                        alignItems:"center"

                    }}>
                        <Text style={{color:"white",fontSize:22,fontWeight:"bold"}}>confim code</Text>

                    </TouchableOpacity>
                </>
            )
            
            }
           
        
           
        </View>
    )
}