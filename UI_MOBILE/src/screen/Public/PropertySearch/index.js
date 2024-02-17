import React from 'react'
import { StatusBar, TouchableOpacity, TextInput, Image, ImageBackground, Picker, Alert } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { Container, Content, Icon, Text, View, ScrollView } from 'native-base'
import RadioGroup from 'react-native-custom-radio-group'
import RNRestart from 'react-native-restart'

import styles from './styles'
import Header from '@component/Header'
import Footer from '@component/FooterBienes'
import { navigate } from '@utility/navigation'
import theme from '@theme/styles'
import Languages from '@config/language'
import { setLocale, __ } from '@utility/translation'
import {REACT_APP_REQ} from '@env'

export const propertyType = [{
  label: __('Comprar'),
  value: 'sale'
}, {
  label: __('Rentar'),
  value: 'rental'
},];

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      country: null,
      dataSource:[],
      dataSource1:[],
      dataProp:[],
      dataSource2:[],
       rutas:"",
        venta_renta: "",
        minimo: "",
        maximo: "",
        id_tipo_bien:"" ,
        id_ciudad:"",
      region: null,
      selected: undefined,
    };
  }










  componentDidMount = () => {
    if(this.state.latitud===0){
      this.getLoc()
    }
    let token =  AsyncStorage.getItem('token');
    fetch(REACT_APP_REQ+'/countries/', {
           method: 'GET',
           headers: {'Content-Type': 'application/json'}
        })
        .then((response) => response.json())
        .then((responseJson) => {
           this.setState({
              dataSource: responseJson.data,
              country: responseJson.data.id_pais,
           })
        })
        .catch((error) => {
           console.error(error);
        });
        fetch(REACT_APP_REQ+'/property/type/', {
           method: 'GET',
           headers: {'Content-Type': 'application/json'}
        })
        .then((response) => response.json())
        .then((responseJson) => {
           this.setState({
              dataProp: responseJson.data,
              id_tipo_bien: responseJson.data.id_tipo_bien,
           })
        })
        .catch((error) => {
           console.error(error);
        });
  
     }
  
     getRegion(country){
        let token =  AsyncStorage.getItem('token');
        fetch(REACT_APP_REQ+`/region/${country}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
          })
          .then((response) => response.json())
          .then((responseJson) => {
            this.setState({
                dataSource1: responseJson.data
            })
          })
          .catch((error) => {
            console.error(error);
          });
     }
  
     getCiudad(region){
      let token =  AsyncStorage.getItem('token');
      fetch(REACT_APP_REQ+`/city/${region}`, {
             method: 'GET',
             headers: {'Content-Type': 'application/json'}
          })
          .then((response) => response.json())
          .then((responseJson) => {
             this.setState({
                dataSource2: responseJson.data
             })
          })
          .catch((error) => {
             console.error(error);
          });
        }
  





  onValueChange(value) {
    this.setState({
      selected: value
    });
  }

  render() {
    return (
      <Container style={theme.layoutFx}>
        <Header statusBarType='dark' navLeftType='back' navMiddleType='medium' title={__('Buscar')} />
        <Content >
          <View style={styles.propertyDetails}>
          <View style={styles.bgGrey}>
            <Picker
              selectedValue={this.state.venta_renta} itemStyle={{height:50}}
              onValueChange={(itemValue, itemIndex) => this.setState({ venta_renta: itemValue })}>
              <Picker.Item label="Seleccione su objetivo" value={null}/>  
              <Picker.Item label={__('Comprar')} value="sale" />
              <Picker.Item label={__('Rentar')} value="rental" style={styles.pickerText}
               />
            </Picker>
          </View>
          </View>
          <View style={styles.location}>
            <Text style={styles.header}>{__('Ubicación')}</Text>
            
            <View style={styles.row}>
        <View style={styles.bgGrey}>
          <Picker selectedValue={this.state.country} itemStyle={{height:50}}
            onValueChange={(itemValue, itemIndex) => {if(itemValue!=this.state.country){this.getRegion(itemValue), this.getCiudad(0), this.setState({ country: itemValue})}}}>
            <Picker.Item label="Seleccione un país" isDisabled/>  
            {this.state.dataSource.map((item)=>(
            <Picker.Item label={item.nombre_pais} value={item.id_pais} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.bgGrey}>
          <Picker
            selectedValue={this.state.region} itemStyle={{height:50}}
            onValueChange={(itemValue, itemIndex) => {if(itemValue!=this.state.region){this.getCiudad(itemValue), this.setState({ region: itemValue })}}}>
              <Picker.Item label="Seleccione una región" />  
            {this.state.dataSource1.map((item)=>(
            <Picker.Item label={item.nombre_region} value={item.id_region} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.bgGrey}>
          <Picker
            selectedValue={this.state.id_ciudad} itemStyle={{height:50}}
            onValueChange={(itemValue, itemIndex) => this.setState({ id_ciudad: itemValue })}>
            <Picker.Item label="Seleccione una ciudad" isDisabled/> 
            {this.state.dataSource2.map((item)=>(
            <Picker.Item label={item.nombre_ciudad} value={item.id_ciudad} />
            ))}
          </Picker>
        </View>
      </View>



          </View>
        
          <View style={styles.location}>
          <View style={styles.row}>
        <View style={styles.bgGrey}>
          <Picker selectedValue={this.state.id_tipo_bien} itemStyle={{height:50}}
            onValueChange={(itemValue, itemIndex) => { this.setState({ id_tipo_bien: itemValue})}}>
            <Picker.Item label="Seleccione un tipo de propiedad" value="disabled"/>  
            {this.state.dataProp.map((item)=>(
            <Picker.Item label={item.desc_tipo_bien} value={item.id_tipo_bien} />
            ))}
          </Picker>
        </View>
      </View>
      </View>





          <View style={styles.price}>
              <Text style={styles.headerPrice}>{__('Precio')}</Text>
                    <View style={styles.row}>
                      <Text style={styles.header} name="minimo">{__('Mínimo en dólares')}</Text>
                      <TextInput style={styles.textInput} keyboardType={'numeric'} placeholder={__('Mínimo')} 
                      onChangeText={(minimo) => this.setState({minimo})} value={this.state.minimo}/>
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.header} name="maximo">{__('Máximo en dólares')}</Text>
                      <TextInput style={styles.textInput} keyboardType={'numeric'} placeholder={__('Máximo')} 
                      onChangeText={(maximo) => this.setState({maximo})} value={this.state.maximo}/>
                    </View>
          </View>
          

          <View style={styles.btnBg}>
            <TouchableOpacity style={styles.searchBtn} onPress={() => {
              if(this.state.id_ciudad==null || this.state.venta_renta==null || this.state.id_tipo_bien==null || this.state.minimo==null || this.state.maximo==null){
                Alert.alert(
                  'Error',
                  'Debe llenar todos los campos',
                  [
                    {
                      text: 'OK'
                    }
                  ]
                )
              }
              else{
              let url = REACT_APP_REQ+'/property/filters/'+this.state.venta_renta+'/city/'+this.state.id_ciudad+'/type/'+this.state.id_tipo_bien+'/lowest/'+this.state.minimo+'/highest/'+this.state.maximo;
               AsyncStorage.setItem('ruta', url);
              this.props.navigation.navigate('PublicProperties'
              
              )
              
            }}}>
              <Text style={styles.searchBtnText}>{__('Buscar')}</Text>
              <Icon active name='search' type="FontAwesome" style={styles.searchBtnIcon} />
            </TouchableOpacity>
          </View>
        </Content >
        <Footer currentScreen='Search'/>
      </Container >
    )
  }
}