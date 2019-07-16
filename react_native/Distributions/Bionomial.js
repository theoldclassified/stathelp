import * as React from 'react';
import {View, Text, StyleSheet, ImageBackground, Dimensions, Picker} from 'react-native';

import {TextInput, Button, Snackbar, DataTable} from 'react-native-paper';
import axios from 'axios';

const win = Dimensions.get('window')

export default class Bio extends React.Component{
    constructor(){
        super();
        this.calculateBio = this.calculateBio.bind(this);
        this.routeToTableView = this.routeToTableView.bind(this);
    }
    state ={
        trial_count: '',
        success: '',
        x: '',

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
     * Routes to the FullTableOutput once server response is recieved 
     */
    routeToTableView = () => {
        console.log('Routing')
        this.props.navigation.navigate('Utils')
    }
    /**
     * Sends GET request to server 
     * Request: /Bionomial 
     * Json payload: {success: '0<=X<=1', trial_count: '1->INF' , x: 'num of success'}
     */
    calculateBio(){
        //checking for errors and sending warning
        
        //empty data
        if(this.state.success == '' || this.state.trial_count == '' || this.state.x == ''){
            console.log("%cCan't perform requests on empty data, sending warning.", "color: red; font-size: 20px")
            this.setState({ empty_data_warning: true })
        }

        else if(this.state.success <0 || this.state.success > 1){
            console.log("Probability not in range")
            this.setState({probability_warning: true})
        }
        //passed safety checks
        else{
            console.log("Sucess: " + this.state.success)
            console.log("Trial Count: " + this.state.trial_count)
            console.log("X: " + this.state.x)

            axios.get('http://stathelp.herokuapp.com/Bionomial', {
                //GET Request payload 
                params: {
                    success: String(this.state.success),
                    trial_count: String(this.state.trial_count),
                    x: String(this.state.x)
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

                    showOutput: true
                })

            })
    
        }
    }   

    render(){
        return(
            <View>
                {/** Input Field */}
                <TextInput
                        label='Trial Count'
                        value={this.state.trial_count}
                        onChangeText= {text  => this.setState({trial_count: text})}
                        style= {styles.textField}
                        multiline= {true}
                        mode= 'outlined'
                        keyboardType='numeric'
                />


                <TextInput
                        label='Probability of Success'
                        value={this.state.success}
                        onChangeText= {text  => this.setState({success: text})}
                        style= {styles.textField}
                        multiline= {true}
                        mode= 'outlined'
                        keyboardType='numeric'
                />

                <TextInput
                        label='Number of Successes (X)'
                        value={this.state.x}
                        onChangeText= {text  => this.setState({x: text})}
                        style= {styles.textField}
                        multiline= {true}
                        mode= 'outlined'
                        keyboardType='numeric'
                />
                <Button  mode="contained" onPress={this.calculateBio} style={styles.button}>
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