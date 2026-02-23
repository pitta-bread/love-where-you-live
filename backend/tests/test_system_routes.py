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
