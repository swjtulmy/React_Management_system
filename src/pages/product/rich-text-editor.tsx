import React, { FC, useState, useImperativeHandle } from 'react'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

interface IProps {
  detail: string;
  cRef: React.MutableRefObject<any>
}

const RichTextEditor: FC<IProps> = ({
  detail,
  cRef
}) => {

  useImperativeHandle(cRef, () => ({
    // changeVal 就是暴露给父组件的方法
    getDetail: () => {
      // 返回输入数据对应的html格式的文本
      return draftToHtml(convertToRaw(edState.getCurrentContent()));
    }
  }));

  const initContent = (): any => {
    if (detail !== '') {
      const contentBlock = htmlToDraft(detail);
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      return editorState;
    }
    return EditorState.createEmpty();
  };

  const [edState, setedState] = useState(initContent());

  /*
  输入过程中实时的回调
   */
  const onEditorStateChange = (editorState: EditorState): void => {
    setedState(editorState);
  };

  

  const uploadImageCallBack = (file: any) => {
    return new Promise(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', '/manage/img/upload')
        const data = new FormData();
        data.append('image', file)
        xhr.send(data)
        xhr.addEventListener('load', () => {
          const response = JSON.parse(xhr.responseText)
          const url = response.data.url // 得到图片的url
          resolve({ data: { link: url } })
        })
        xhr.addEventListener('error', () => {
          const error = JSON.parse(xhr.responseText)
          reject(error)
        })
      }
    )
  }
  return (
    <Editor
      editorState={edState}
      editorStyle={{ border: '1px solid black', minHeight: 200, paddingLeft: 10 }}
      onEditorStateChange={onEditorStateChange}
      toolbar={{
        image: {
          urlEnabled: true,
          uploadEnabled: true,
          alignmentEnabled: true,   // 是否显示排列按钮 相当于text-align
          uploadCallback: uploadImageCallBack,
          previewImage: true,
          inputAccept: 'image/*',
          alt: { present: false, mandatory: false, previewImage: true }
        },
      }}
    />
  )
}
export default RichTextEditor