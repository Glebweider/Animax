import { StyleSheet, View, Text, ScrollView } from 'react-native';
import BackButton from '../../components/BackButton';

const PrivacyPolicyScreen = ({ navigation }) => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <BackButton navigation={navigation} text="Privacy Policy" />
            <View style={styles.contentContainer}>
                <Text style={styles.contentTitle}>1. Types of Data We Collect</Text>
                <Text style={styles.contentText}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.contentTitle}>2. Use of Your Personal Data</Text>
                <Text style={styles.contentText}>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</Text>
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.contentTitle}>3. Disclosure of Your Personal Data</Text>
                <Text style={styles.contentText}>But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#181A20',
        paddingBottom: 25
    },
    contentContainer: {
        width: '90%',
        marginTop: 10,
    },
    contentTitle: {
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 18,
    },
    contentText: {
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 12,
    }
});
    
export default PrivacyPolicyScreen;