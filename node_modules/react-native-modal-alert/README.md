# react-native-modal-alert

A react-native custom alert component

### Install

`yarn add react-native-modal-alert`

or

`npm install -S react-native-modal-alert`

### Usage

```javascript
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import ModalAlert from 'react-native-modal-alert';

export default class App extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            isShow: false
        };
    }

    show = () => {
        this.setState({ isShow: true });
    };

    hide = () => {
        this.setState({ isShow: false });
    };

    onShow = () => {
        console.log('render alert');
    };

    render() {
        return (
            <View>
                <TouchableOpacity
                        onPress={this.show}
                        style={{
                            width: 300,
                            height: 200,
                            backgroundColor: '#fff',
                            borderRadius: 4
                        }}
                    >
                        <Text>Toggle</Text>
                </TouchableOpacity>
                <ModalAlert
                    visible={this.state.isShow}
                    onShow={this.onShow}
                    onClose={this.hide}
                >
                    <View><Text>modal content</Text></View>
                </ModalAlert>
            </View>
        );
    }
}
```
