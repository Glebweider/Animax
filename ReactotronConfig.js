import Reactotron from "reactotron-react-native";

Reactotron.setAsyncStorageHandler()
	.configure({
		name: "Animax",
	})
	.useReactNative({
		asyncStorage: false,
		networking: {
			ignoreUrls: /symbolicate/,
		},
		editor: false,
		errors: { veto: (stackFrame) => false },
		overlay: false,
	})
	.connect();