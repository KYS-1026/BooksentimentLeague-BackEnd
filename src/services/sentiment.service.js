// sentiment.service.js
import { config } from '../../config/db.config.js';
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { pool } from "../../config/db.config.js";
//import session from 'express-session';
//import { deleteImageFromS3 } from '../middleware/ImageUploader.js';
// import DTOs
import { sentimentDTO } from "../dtos/sentiment.dto.js";
import { WriteCommentResponseDTO } from "./../dtos/sentiment.response.dto.js"

// import DAOs
import { addSentiment, getSentiment, modifyImage } from "../models/sentiment.dao.js";
import { modifySentiment } from "../models/sentiment.dao.js";
import { eliminateSentiment } from "../models/sentiment.dao.js";
import { getUserId } from "../models/sentiment.sql.js";
import { createComment, findCommentById, removeComment } from "../models/sentiment.dao.js";

// 센티멘트 작성
export const insertSentiment = async (userId, body, files) => {
  const img_array = files.map(file=>file.location);
  const insertSentimentData = await addSentiment(userId, {
    //'sentiment_id' : body.sentiment_id,
    'user_id': userId,
    'sentiment_title': body.sentiment_title,
    'book_title': body.book_title,
    'score': body.score,
    'content': body.content,
    "image": img_array,
    'book_image': body.book_image,
    'author' : body.author,
    'publisher' : body.publisher,
    'season': 1 // body에 season 없음 -> req에 시즌이 없음 -> 1로 정해놓음 
  });
  console.log('insertSentimentData : ', insertSentimentData);
  if (insertSentimentData == -1) { 
    throw new BaseError(status.SENTIMENT_ALREADY_EXIST);
  } else {
    console.log('sentimentDTO: ', sentimentDTO(await getSentiment(insertSentimentData)))
    return sentimentDTO(await getSentiment(insertSentimentData));
  }
}

// 센티멘트 수정
export const updateSentiment = async (sentimentId, body, files) => {
  try {
    /*
    const postId = await pool.query(getUserId,[sentimentId]);
    const currentId = req.session.userId;
    if ( postId == currentId ) { // 현재 로그인한 사용자와 작성자의 id가 동일한지 확인 */
    const existingSentiment = await getSentiment(sentimentId);
    // 디버깅을 위한 로그
    console.log('Existing Sentiment:', existingSentiment);
    if (!existingSentiment) {
      throw new BaseError(status.SENTIMENT_NOT_FOUND);
    }

    // 이미지 삭제 로직
    console.log('update Sentiment body: ', body);
    
      
    //이미지 레코드 삭제
    await modifyImage(sentimentId, body, files);

    // 이후 실행하여 변경된 image 테이블에 저장된 데이터를 포함하여 전체적으로 업데이트
    const modifiedData = await modifySentiment(sentimentId, {

      "sentiment_title": body.sentiment_title,
      "book_title": body.book_title,
      "score": body.score,
      "content": body.content,
    });

    // 수정된 센티멘트 정보 반환
    return sentimentDTO(await getSentiment(modifiedData));

  } catch (err) {
    console.error('Error:', err);
    throw new BaseError(status.PARAMETER_IS_WRONG);
  }
}

// 센티멘트 삭제 
export const deleteSentiment = async (sentimentId) => {
  try {
    // 센티멘트 존재 여부 확인
    const sentimentInfo = await getSentiment(sentimentId);

    if (sentimentInfo === -1) {
      return { message: '센티멘트를 찾을 수 없습니다.' };
    }

    // 센티멘트 삭제 실행
    await eliminateSentiment(sentimentId); // 멀티 파일이면 file 통으로 넘겨주기 key->file

    // 삭제 후 반환
    return { message: '센티멘트가 성공적으로 삭제되었습니다.' };
  } catch (err) {
    console.error(err);
    throw new BaseError(status.PARAMETER_IS_WRONG);
  }
}

// 댓글 작성
export const insertComment = async (sentimentId, userId, parent_id, content) => {
    try {
        const newComment = await createComment(sentimentId, userId, parent_id, content);
        return WriteCommentResponseDTO(newComment);
    } catch (error) {
        console.error('Error in insertComment:', error);
        throw error;
    }
}

// 댓글 삭제
export const deleteComment = async (commentId, userData) => {
    try {
        // 삭제하려는 댓글이 존재하는지 확인
        const comment = await findCommentById(commentId);
        if (!comment) {
            throw new Error('Comment not found');
        }

        // 삭제하려는 댓글 작성자와 현재 사용자가 같은지 확인
        if (comment.user_id !== userData[0].user_id) {
            throw new BaseError(status.COMMENT_NOT_DELETE);
        }

        await removeComment(commentId);
    } catch (error) {
        console.error('Error in deleteComment:', error);
        throw error;
    }
};