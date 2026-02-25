def test_health(client):
    response = client.get('/health')

    assert response.status_code == 200
    assert response.json() == {'status': 'ok'}


def test_hello(client):
    response = client.get('/hello')

    assert response.status_code == 200
    assert response.json() == {
        'message': 'Hello world from Love Where You Live backend'
    }


def test_cors_allows_configured_origin(client):
    response = client.get('/health', headers={'Origin': 'http://localhost:5173'})

    assert response.status_code == 200
    assert response.headers['access-control-allow-origin'] == 'http://localhost:5173'


def test_cors_blocks_unconfigured_origin(client):
    response = client.get('/health', headers={'Origin': 'https://malicious.example'})

    assert response.status_code == 200
    assert 'access-control-allow-origin' not in response.headers


def test_cors_disables_credentials_header(client):
    response = client.get('/health', headers={'Origin': 'http://localhost:5173'})

    assert response.status_code == 200
    assert 'access-control-allow-credentials' not in response.headers
