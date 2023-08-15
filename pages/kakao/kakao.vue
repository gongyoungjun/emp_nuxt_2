<template>
  <div>
    <button @click="loginWithKakao">카카오로 로그인</button>
    <button @click="getFriendsList">친구 목록 가져오기</button>
    <button @click="sendKakaoMessage">알림톡 보내기</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const KAKAO_API_KEY = 'f560cc539bb67250f4abca77cee2a9ec'; // 카카오 앱 키
const accessToken = ref('');
const friendsList = ref([]);
const selectedFriend = ref('');

const loginWithKakao = () => {
  Kakao.init(KAKAO_API_KEY);
  Kakao.Auth.login({
    success: (authObj) => {
      accessToken.value = authObj.access_token;
    },
    fail: (error) => {
      console.error('카카오 로그인 실패:', error);
    }
  });
};

const getFriendsList = () => {
  Kakao.API.request({
    url: '/v1/api/talk/friends',
    success: (response) => {
      friendsList.value = response.elements;
    },
    fail: (error) => {
      console.error('친구 목록 가져오기 실패:', error);
    }
  });
};

const sendKakaoMessage = () => {
  if (!selectedFriend.value) {
    alert('친구를 선택해주세요.');
    return;
  }

  const message = '알림톡 내용을 입력하세요.';
  const templateObject = {
    object_type: 'text',
    text: message,
  };

  Kakao.API.request({
    url: `/v1/api/talk/friends/message/default/send?receiver_uuids=${selectedFriend.value}`,
    data: {
      template_object: JSON.stringify(templateObject)
    },
    success: (response) => {
      console.log('알림톡 전송 성공:', response);
      alert('알림톡을 성공적으로 보냈습니다.');
    },
    fail: (error) => {
      console.error('알림톡 전송 실패:', error);
      alert('알림톡 전송에 실패하였습니다.');
    }
  });
};
</script>