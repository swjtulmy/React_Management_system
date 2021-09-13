import React, { FC, useState,useImperativeHandle,useEffect } from 'react'
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {BASE_IMG_URL} from "../../utils/constants"
import { reqDeleteImg } from '../../api'

interface IProps {
  imgs: [];
  cRef: React.MutableRefObject<any>;
}

const PictureWall: FC<IProps> = ({
  imgs,
  cRef
}) => {
  const [previewVisible, setpreviewVisible] = useState(false);
  const [previewImage, setpreviewImage] = useState('');
  const [fileList, setfileList] = useState([
    /*{
      uid: '-1', // 每个file都有自己唯一的id
      name: 'xxx.png', // 图片文件名
      status: 'done', // 图片状态: done-已上传, uploading: 正在上传中, removed: 已删除
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png', // 图片地址
    },*/
  ]);

  useEffect(() => {
    let fl: any;
    if (imgs && imgs.length>0) {
      fl = imgs.map((img, index) => ({
        uid: -index, // 每个file都有自己唯一的id
        name: img, // 图片文件名
        status: 'done', // 图片状态: done-已上传, uploading: 正在上传中, removed: 已删除
        url: BASE_IMG_URL + img
      }))
    }
    setfileList(fl);
  }, [])

  useImperativeHandle(cRef, () => ({
    // changeVal 就是暴露给父组件的方法
    getImgs: (): any => {
      return fileList.map((file: any) => file.name);
    }
  }));

  const handlePreview = (file: any) => {
    setpreviewImage(file.url || file.thumbUrl);
    setpreviewVisible(true);
  }

  const handleChange = async ({ file, fileList }: any) => {
    // 一旦上传成功, 将当前上传的file的信息修正(name, url)
    if (file.status === 'done') {
      const result = file.response  // {status: 0, data: {name: 'xxx.jpg', url: '图片地址'}}
      if (result.status === 0) {
        message.success('上传图片成功!')
        const { name, url } = result.data
        file = fileList[fileList.length - 1]
        file.name = name
        file.url = url
      } else {
        message.error('上传图片失败')
      }
    } else if (file.status === 'removed') { // 删除图片
      const result: any = await reqDeleteImg(file.name);
      if (result.status === 0) {
        message.success('删除图片成功!')
      } else {
        message.error('删除图片失败!')
      }
    }
    // 在操作(上传/删除)过程中更新fileList状态
    setfileList(fileList)
  };
  const handleCancel = () => setpreviewVisible(false);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div>Upload</div>
    </div>
  );
  return (
    <div>
      <Upload
        action="/manage/img/upload" /*上传图片的接口地址*/
        accept='image/*'  /*只接收图片格式*/
        name='image' /*请求参数名*/
        listType="picture-card"  /*卡片样式*/
        fileList={fileList}  /*所有已上传图片文件对象的数组*/
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {fileList.length >= 4 ? null : uploadButton}
      </Upload>

      <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  )
}
export default PictureWall