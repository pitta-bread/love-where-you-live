import { describe, expect, it, vi } from 'vitest';
import { createProject, deleteProject, getProject, listProjects } from './projects-api';

describe('projects-api shared secret header', () => {
	it('includes x-backend-secret and x-vercel-protection-bypass when listing projects', async () => {
		const fetchFn = vi.fn(async () =>
			new Response(JSON.stringify([]), {
				status: 200,
				headers: { 'content-type': 'application/json' }
			})
		);

		await listProjects(
			fetchFn as typeof fetch,
			'https://api.example.com',
			'user@example.com',
			'top-secret',
			'bypass-secret'
		);

		expect(fetchFn).toHaveBeenCalledWith('https://api.example.com/api/v1/projects', {
			headers: {
				'x-user-email': 'user@example.com',
				'x-backend-secret': 'top-secret',
				'x-vercel-protection-bypass': 'bypass-secret'
			}
		});
	});

	it('includes x-backend-secret and x-vercel-protection-bypass when creating projects', async () => {
		const fetchFn = vi.fn(async () =>
			new Response(JSON.stringify({ id: 1 }), {
				status: 201,
				headers: { 'content-type': 'application/json' }
			})
		);

		await createProject(
			fetchFn as typeof fetch,
			'https://api.example.com',
			{
				name: 'Move 1',
				area: 'Bristol',
				default_transport_mode: 'drive'
			},
			'user@example.com',
			'top-secret',
			'bypass-secret'
		);

		expect(fetchFn).toHaveBeenCalledWith('https://api.example.com/api/v1/projects', {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				'x-user-email': 'user@example.com',
				'x-backend-secret': 'top-secret',
				'x-vercel-protection-bypass': 'bypass-secret'
			},
			body: JSON.stringify({
				name: 'Move 1',
				area: 'Bristol',
				default_transport_mode: 'drive'
			})
		});
	});

	it('includes request headers when loading and deleting a project', async () => {
		const fetchFn = vi
			.fn()
			.mockImplementationOnce(async () =>
				new Response(JSON.stringify({ id: 1 }), {
					status: 200,
					headers: { 'content-type': 'application/json' }
				})
			)
			.mockImplementationOnce(async () => new Response(null, { status: 204 }));

		await getProject(
			fetchFn as typeof fetch,
			'https://api.example.com',
			1,
			'user@example.com',
			'top-secret',
			'bypass-secret'
		);
		await deleteProject(
			fetchFn as typeof fetch,
			'https://api.example.com',
			1,
			'user@example.com',
			'top-secret',
			'bypass-secret'
		);

		expect(fetchFn).toHaveBeenNthCalledWith(1, 'https://api.example.com/api/v1/projects/1', {
			headers: {
				'x-user-email': 'user@example.com',
				'x-backend-secret': 'top-secret',
				'x-vercel-protection-bypass': 'bypass-secret'
			}
		});
		expect(fetchFn).toHaveBeenNthCalledWith(2, 'https://api.example.com/api/v1/projects/1', {
			method: 'DELETE',
			headers: {
				'x-user-email': 'user@example.com',
				'x-backend-secret': 'top-secret',
				'x-vercel-protection-bypass': 'bypass-secret'
			}
		});
	});
});
