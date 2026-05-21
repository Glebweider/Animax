import { Platform } from 'react-native';

interface IRequestOptions extends RequestInit {
	token?: string;
	body?: any;
}

export const apiRequest = async <T>(
	endpoint: string,
	options: IRequestOptions = {},
): Promise<T | null> => {
	try {
		const headers: HeadersInit = {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'X-Device-Platform': Platform.OS,
			'X-Request-Source': 'app',
			...options.headers,
		};

		if (options.token) {
			headers['Authorization'] = options.token;
		}

		const response = await fetch(
			`${process.env.EXPO_PUBLIC_API_URL}/api${endpoint}`,
			{
				...options,
				headers,
				body: options.body
					? JSON.stringify(options.body)
					: undefined,
			},
		);

		const text = await response.text();
		let data: any = null;

		const contentType = response.headers.get('content-type');
		if (contentType && contentType.includes('application/json')) {
			try {
				data = text ? JSON.parse(text) : null;
			} catch {
				data = text;
			}
		} else {
			data = text || null;
		}

		if (!response.ok) {
			throw new Error(data?.message?.message || 'Request failed');
		}

		return data;
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.log(error)
			throw new Error(error.message);
		}

		throw new Error('Unknown network error');
	}
};