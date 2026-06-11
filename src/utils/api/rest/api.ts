import { Platform } from 'react-native';

import { getTokenFromStorage } from '@Utils/functions';
import { i18n } from '@Utils/localization';


interface IRequestOptions extends RequestInit {
	token?: boolean;
	body?: any;
	isMultipart?: boolean;
	rawBody?: BodyInit;
}

export const apiRequest = async <T>(
	endpoint: string,
	options: IRequestOptions = {},
): Promise<T> => {
	try {
		const isMultipart = options.isMultipart;

		const headers: HeadersInit = {
			Accept: 'application/json',
			'X-Device-Platform': Platform.OS,
			'X-Request-Source': 'app',
			'locale': i18n.locale,
			...options.headers,
		};

		if (!isMultipart)
			headers['Content-Type'] = 'application/json';

		if (options.token)
			headers['Authorization'] = getTokenFromStorage();

		const body =
			options.rawBody ??
			(options.body
				? isMultipart
					? options.body // FormData
					: JSON.stringify(options.body)
				: undefined);

		const response = await fetch(
			`${process.env.EXPO_PUBLIC_API_URL}/api${endpoint}`,
			{
				...options,
				headers,
				body,
			},
		);

		const text = await response.text();

		let data: any;
		const contentType = response.headers.get('content-type');

		if (contentType?.includes('application/json')) {
			try {
				data = text ? JSON.parse(text) : null;
			} catch {
				data = text;
			}
		} else {
			data = text || null;
		}

		if (!response.ok) {
			const message =
				data?.message ||
				data?.error ||
				(typeof data === 'string' ? data : null) ||
				'Request failed';

			throw new Error(message);
		}

		return data as T;
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error('[API ERROR]', error.message);
			throw error;
		}

		throw new Error('Unknown network error');
	}
};