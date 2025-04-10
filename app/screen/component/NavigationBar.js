import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function NavigationBar({ navigation }) {
	const insets = useSafeAreaInsets();

	const state = navigation.getState();
	const currentTab = state.routes[state.index].name;

	const isActive = (tabName) => currentTab === tabName;

	return (
		<View style={[styles.navBar, { paddingBottom: insets.bottom }]}>
			<TouchableOpacity
				style={styles.navItem}
				onPress={() => navigation.navigate('Home')}>
				<Ionicons
					name="home-outline"
					size={24}
					color={isActive('Home') ? '#FF5555' : 'rgba(255, 255, 255, 0.6)'}
				/>
				<Text
					style={[
						styles.navText,
						{
							color: isActive('Home') ? '#FF5555' : 'rgba(255, 255, 255, 0.6)',
						},
					]}>
					Home
				</Text>
			</TouchableOpacity>

			{/* <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("MyWardrobeScreen")}
      >
        <AntDesign
          name="inbox"
          size={24}
          color={isActive("MyWardrobeScreen") ? "#FF5555" : "rgba(255, 255, 255, 0.6)"}
        />
        <Text
          style={[
            styles.navText,
            {
              color: isActive("MyWardrobeScreen") ? "#FF5555" : "rgba(255, 255, 255, 0.6)",
            },
          ]}
        >
          Wardrobe
        </Text>
      </TouchableOpacity> */}

			<TouchableOpacity
				style={styles.navItem}
				onPress={() => navigation.navigate('ChatScreen')}>
				<Ionicons
					name="chatbox-outline"
					size={24}
					color={
						isActive('ChatScreen') ? '#FF5555' : 'rgba(255, 255, 255, 0.6)'
					}
				/>
				<Text
					style={[
						styles.navText,
						{
							color: isActive('ChatScreen')
								? '#FF5555'
								: 'rgba(255, 255, 255, 0.6)',
						},
					]}>
					AI
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={styles.navItem}
				onPress={() => navigation.navigate('ProfileScreen')}>
				<Ionicons
					name="person-outline"
					size={24}
					color={
						isActive('ProfileScreen') ? '#FF5555' : 'rgba(255, 255, 255, 0.6)'
					}
				/>
				<Text
					style={[
						styles.navText,
						{
							color: isActive('ProfileScreen')
								? '#FF5555'
								: 'rgba(255, 255, 255, 0.6)',
						},
					]}>
					Profile
				</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	navBar: {
		width: '100%',
		backgroundColor: '#1E1E2F',
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		position: 'absolute',
		bottom: 0,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 10,
		borderTopWidth: 1,
		borderTopColor: '#333',
	},
	navItem: {
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
		paddingVertical: 12,
	},
	navText: {
		fontSize: 12,
		marginTop: 4,
		fontWeight: '600',
	},
});
