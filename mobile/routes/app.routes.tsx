import Home from "@/app/screens/Home"
import Login from "@/app/screens/Login"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

const { Navigator, Screen } = createNativeStackNavigator()

export default function AppRoutes(){
    return(
        <Navigator screenOptions={{headerShown: false}}>
            <Screen name="screens/Login/index"
            component={Login}/>
            <Screen name="screens/Home/index"
            component={Home}/>
        </Navigator>
    )
}