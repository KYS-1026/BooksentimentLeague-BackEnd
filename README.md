# BooksentimentLeague-BackEnd
BooksentimentLeague-BackEnd

1. 팔로우하기 API
: /users/{user-id}/follow
- 팔로우되지 않은 상태라면 -> "팔로우" 수행 -> follow_status : "follow" 반환
- 이미 팔로우 된 상태라면 -> "언팔로우" 수행 -> follow_status : "following" 반환

2. 추천하기(센티멘트)
: /users/{user-id}/like/sentiment/{sentiment-id}
- 본인 센티멘트는 추천할 수 없도록 함
- 이미 추천된 센티멘트는 like 값을 0으로 업데이트