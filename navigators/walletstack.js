import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Wallet from '../components/wallet';
import Deposit from '../components/deposit';
import Withdraw from '../components/withdraw';
import BillPayment from '../components/billpayment';
import Transactions from '../components/transactions';
import { ThemeContext } from '../contexts/ThemeContext';
import { colors } from '../config/theme';
import { useContext } from 'react';

export default function WalletStack() {
    const Stack = createNativeStackNavigator();
    const { theme } = useContext(ThemeContext);

    return(
        <Stack.Navigator screenOptions={{headerShown: false, contentStyle: {backgroundColor: colors[theme.mode].background}}}>
            <Stack.Screen name="wallet" component={Wallet}/>
            <Stack.Screen name="deposit" component={Deposit}/>
            <Stack.Screen name="withdraw" component={Withdraw}/>
            <Stack.Screen name="billpayment" component={BillPayment}/>
            <Stack.Screen name="transactions" component={Transactions}/>
        </Stack.Navigator>
    );
}