from aiobotocore.session import get_session

from app.config import settings


class Storage:
    def __init__(self):
        self.bucket = settings.s3_bucket
        self.session = get_session()
        self.config = {
            "endpoint_url": settings.s3_endpoint_url,
            "aws_access_key_id": settings.s3_access_key,
            "aws_secret_access_key": settings.s3_secret_key,
        }

    def _client(self):
        return self.session.create_client("s3", **self.config)

    async def put(self, key: str, data: bytes) -> None:
        async with self._client() as s3:
            await s3.put_object(Bucket=self.bucket, Key=key, Body=data)

    async def get(self, key: str) -> bytes:
        async with self._client() as s3:
            response = await s3.get_object(Bucket=self.bucket, Key=key)
            async with response["Body"] as stream:
                return await stream.read()

    async def delete(self, key: str) -> None:
        async with self._client() as s3:
            await s3.delete_object(Bucket=self.bucket, Key=key)


storage = Storage()
