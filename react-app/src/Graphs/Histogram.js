import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';

import Plot from 'react-plotly.js';

const styles = {

}; 

class Histogram extends React.Component{
    constructor(){
        super();
        this.plot = this.plot.bind(this);
    }

    state = {
        input_data: '',
        plot_array: [],
        showOutput: false,
        
        empty_data_warning: false,
    };
    /**
     * Prepares the user input for plotly and sets output to true 
     */
    plot(){
        console.log("Plotting Histogram")
        //check if input_data has been added 
        if(this.state.input_data == ''){
            console.log("%cCan't perform requests on empty data, sending warning.", "color: red; font-size: 20px")
            this.setState({ empty_data_warning: true })

        }
        else{
            //convert csv input_string -> array
            var arr = this.state.input_data.split(',')

            this.setState({ 
                showOutput: true, 
                plot_array: arr,
            })
        }
    }
    
    render(){
        const { classes } = this.props;
        return(
            <div>
                <TextField
                    id="outlined-full-width"
                    
                    value = {this.state.input_data}
                    onChange = {e => this.setState({input_data: e.target.value})} 
                    label="Input Data"
                    placeholder="Example: 12, 33, 44"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                    shrink: true,
                    }}
                />
                <Button 
                        variant="contained"
                            color="secondary" 
                            onClick={this.plot}
                            className={classes.button}
                            style={{justifyContent: 'center'}}
                            size="large"
                        >
                            Plot
                </Button>

                <div className= {this.state.showOutput ? '':'disappear' }>
                {/** Plotly Graph */}
                <Plot
                    data={[
                    {
                        x: this.state.plot_array,
                        type: 'histogram',
                    },
                    ]}
                    layout={ {width: '10vh', height: '20vh', title: 'Histogram'} }
                />
                </div>

                {/** Empty data Warning SnackBar */}
                <Snackbar
                    autoHideDuration={2000}
                    open={this.state.empty_data_warning}
                    onClose={() => this.setState({empty_data_warning: false})}
                    message={<span id="message-id">Incomplete Data.</span>}
                
                />

            </div>
        );
    }
}

Histogram.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Histogram);

