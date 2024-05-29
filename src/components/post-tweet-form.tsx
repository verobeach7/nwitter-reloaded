import { addDoc, collection, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  background-color: #1d9bf0;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

export default function PostTweetForm() {
  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1mb
  const [isLoading, setLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    // input에서 파일을 딱 하나만 받고 있는지 확인
    if (files && files.length === 1) {
      if (files[0].size > MAX_FILE_SIZE) {
        alert("File size must be under 1mb!");
        setFile(null);
        return;
      }
      setFile(files[0]);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading || tweet === "" || tweet.length > 180) return;
    try {
      setLoading(true);
      /* 1. firestore database에 저장 */
      // addDoc(collection(firestore, "{collectionName}"),{data})
      const doc = await addDoc(collection(db, "tweets"), {
        tweet,
        createdAt: Date.now(),
        // user가 displayName을 설정하지 않았거나 비공개인 경우 "Anonymous"로 설정
        username: user.displayName || "Anonymous",
        // 이 tweet을 삭제하고자 할 때 현재 로그인한 유저와 tweet을 작성한 유저가 같은지 확인하기 위해 필요
        userId: user.uid,
      });
      /* 2. file이 있다면 storage에 저장 */
      // 파일 업로드를 위해 reference 생성
      if (file) {
        // ref(storage, 경로)
        const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`);
        /* 3. 업로드 후 결과 받기 */
        // uploadBytes 함수(경로, 파일); -> 업로드 결과를 반환
        const result = await uploadBytes(locationRef, file);
        /* 4. storage에 업로드 한 file의 download url 받기 */
        // getDownloadURL 함수 -> result의 public URL을 반환
        const url = await getDownloadURL(result.ref);
        /* 5. download url을 이용하여 file의 경로를 firestore에 저장 */
        await updateDoc(doc, {
          photo: url,
        });
      }
      setTweet("");
      setFile(null);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        required
        rows={5}
        maxLength={180}
        onChange={onChange}
        value={tweet}
        placeholder="What is happening?!"
      />
      {/* htmlFor와 id를 file로 맞춰줌으로써 Add photo Label을 클릭해도 AttachFileInput을 클릭한 것처럼 작동함!!! */}
      <AttachFileButton htmlFor="file">
        {file ? "Photo added ✅" : "Add photo"}
      </AttachFileButton>
      {/* file input을 꾸미는 것이 어려워서 자신은 display: none으로 숨기고 위처럼 연결해서 사용 */}
      <AttachFileInput
        onChange={onFileChange}
        type="file"
        id="file"
        accept="image/*"
      />
      <SubmitBtn
        type="submit"
        value={isLoading ? "Posting..." : "Post Tweet"}
      />
    </Form>
  );
}
