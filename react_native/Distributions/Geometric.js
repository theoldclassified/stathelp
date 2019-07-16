import * as React from 'react';
import {View, Text, StyleSheet, ImageBackground, Dimensions, Picker} from 'react-native';

import {TextInput, Button, Snackbar, DataTable} from 'react-native-paper';
import axios from 'axios';

const win = Dimensions.get('window')

export default class Geometric extends React.Component{
    constructor(){
        super();
        this.calculateGeo = this.calculateGeo.bind(this);
    }
    state ={
        probability: '',
        failure: '',
        rounding: '',

        empty_data_warning: false,
        probability_warning: false,

        //server res
        answer: '',
        answer_lt: '',
        answer_gt: '',
        answer_lt_eq: '',
        answer_gt_eq: '',

        //true once server output is recieved
        showOutput:false, 
    }

    /**
     * Sends GET request to server 
     * Request: /Chi
     * Json payload: {failure: number of trials, probablity: prob of success}
     */
    calculateGeo(){
        //checking for errors and sending warning
        if(this.state.failure == '' || this.state.probability == ''){
            console.log("%cCan't perform requests on empty data, sending warning.", "color: red; font-size: 20px")
            this.setState({ empty_data_warning: true })
        }
        else if(this.state.probability <0 || this.state.probability > 1){
            console.log("Probability not in range")
            this.setState({probability_warning: true})
        }

        else{
            console.log("Probability of success: " + this.state.probability)
            console.log("Number of failures: " + this.state.failure)

            axios.get('http://stathelp.herokuapp.com/Geo', {
                //GET Request payload 
                params: {
                    probability: String(this.state.probability),
                    failure: String(this.state.failure),
                    rounding: String(this.state.rounding),
                }
            })
            .then(res =>{
                //response 
                var res_json = res.data
                console.log("Server Response: " + JSON.stringify(res_json))
                //Response JSON: {answer(=) , answer_lt(<), answer_lt_eq(=<), answer_gt_eq(>=)}
                this.setState({
                    answer: res_json['Answer'],   
                    answer_lt : res_json['Answer_lt'],
                    answer_lt_eq: res_json['Answer_lt_eq'],
                    answer_gt: res_json['Answer_gt'],
                    answer_gt_eq: res_json['Answer_gt_eq'],

                    showOutput: true,
                })
            })
    
        }
    }

    render(){
        return(
            <View>
                {/** Input Field */}
                <TextInput
                        label='Probability of Success'
                        value={this.state.probability}
                        onChangeText= {text  => this.setState({probability: text})}
                        style= {styles.textField}
                        multiline= {true}
                        mode= 'outlined'
                        keyboardType='numeric'
                />


                <TextInput
                        label='Number of trials (n)'
                        value={this.state.failure}
                        onChangeText= {text  => this.setState({failure: text})}
                        style= {styles.textField}
                        multiline= {true}
                        mode= 'outlined'
                        keyboardType='numeric'
                />

                <TextInput
                        label='Rounding'
                        value={this.state.rounding}
                        onChangeText= {text  => this.setState({rounding: text})}
                        style= {styles.textField}
                        multiline= {true}
                        mode= 'outlined'
                        keyboardType='numeric'
                />

                <Button  mode="contained" onPress={this.calculateGeo} style={styles.button}>
                        Calculate
                </Button>

                {/** Incomplete data warning  */}
                <Snackbar
                        visible={this.state.empty_data_warning}
                        onDismiss={() => this.setState({ empty_data_warning: false })}
                        duration = {600}
                        style = {styles.Snackbar}
                        >
                        Incomplete Data. 
                </Snackbar>

                {/**  Probability not in 1-0 Range Warning */}
                <Snackbar
                        visible={this.state.probability_warning}
                        onDismiss={() => this.setState({ probability_warning: false })}
                        duration = {600}
                        style = {styles.Snackbar}
                        >
                        Probability must be between 0-1. 
                </Snackbar>
                {/** Server Output */}
                {this.state.showOutput &&
                        <View style={styles.outputFlexbox}>
 
                        <DataTable>
                             
                             <DataTable.Header>
                             <DataTable.Title>P(X)</DataTable.Title>
                             <DataTable.Title numeric>Probabiliy</DataTable.Title>
                             </DataTable.Header>
 
                             <DataTable.Row>
                             <DataTable.Cell> Answer</DataTable.Cell>
                             <DataTable.Cell numeric>{this.state.answer} 
                             </DataTable.Cell>
                             </DataTable.Row>
 
                             <DataTable.Row>
                             <DataTable.Cell> Answer_lt</DataTable.Cell>
                             <DataTable.Cell numeric>{this.state.answer_lt} 
                             </DataTable.Cell>
                             </DataTable.Row>
 
                             <DataTable.Row>
                             <DataTable.Cell> Answer_gt</DataTable.Cell>
                             <DataTable.Cell numeric>{this.state.answer_gt} 
                             </DataTable.Cell>
                             </DataTable.Row>
                             
                             <DataTable.Row>
                             <DataTable.Cell> Answer_lt_eq</DataTable.Cell>
                             <DataTable.Cell numeric>{this.state.answer_lt_eq} 
                             </DataTable.Cell>
                             </DataTable.Row>
 
                             <DataTable.Row>
                             <DataTable.Cell> Answer_gt_eq</DataTable.Cell>
                             <DataTable.Cell numeric>{this.state.answer_gt_eq} 
                             </DataTable.Cell>
                             </DataTable.Row>
 
                        </DataTable>
                        <Button  onPress={this.copytoclipboard} style={styles.button}>
                            Copy to clipboard
                        </Button>  
                        </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    textField:{
        backgroundColor: 'white',
        maxWidth: win.width/1.08
    },
    button:{
        top: 50,
        maxWidth: win.width/1.08
    },
    Snackbar:{
        top: 150,
    },
    outputFlexbox:{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        top: 50,
    },
})



