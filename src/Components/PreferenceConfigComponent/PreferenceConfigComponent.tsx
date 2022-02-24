import React, { useState, useCallback, useEffect } from "react";
import clsx from "clsx";
import qs from "qs";
import produce from "immer";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { setPrefSoundConfig, setPomoConfig } from "@/Redux/userReducer";

// Axios
import request from "axios";
import axios, { path as p, query as q } from "@/Utils/apiController"

// AntDesign
import { Typography, Select, Button, Form, Divider, InputNumber } from "antd";
import {
  EditOutlined,
  PlayCircleOutlined,
  HourglassOutlined
} from '@ant-design/icons';

// Custom Component
import openNotification from "@/Components/Notification/Notification";

// Class & Styles
import classes from "./PreferenceConfigComponent.module.less"

//Desconstructor
const { Title, Text } = Typography;
const { OptGroup, Option } = Select;

type SoundDataType = {
  title: string;
  sounds: SoundInfoType[]
}
type SoundInfoType = {
  name: string;
  url: string;
}
type AudioType = {
  playing: {
    type: string;
    active: boolean;
  };
  data: SoundType[];
}
type SoundType = {
  type: string;
  name: string;
  audio: HTMLAudioElement
}

type ItemType = {
  id: string;
  attributes: {
    alert: {
      data: AlertType[]
    };
    title: string;
  };
}
type AlertType = {
  id: string;
  attributes: {
    name: string;
    url: string;
  }
}
type ValuesType = {
  id: number;
  long: string;
  short: string;
  work: string;
}
const PreferenceConfigComponent = () => {
  const { user } = useSelector((state: RootState) => state);
  const { sounds } = user.userConfig.preferenceConfig;
  const { token } = user;

  // STATES -------------------------------------------------
  const [edit, setEdit] = useState<boolean>(false);
  const [sound, setSound] = useState<SoundDataType[]>([]);
  const [audio, setAudio] = useState<AudioType>({
    playing: {
      type: "",
      active: false,
    },
    data: [],
  });

  // UTILS -----------------------------------------------------

  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // -----------------------------------------------------
  const getAllSound = useCallback(async () => {
    const query = qs.stringify({
      populate: ['alert']
    })
    const { data: res } = await axios(token).get("/api/sounds?" + query);

    res.data.forEach((item: ItemType) => {
      const { data } = item.attributes.alert;
      let sounds: SoundInfoType[] = []
      data.forEach((s: AlertType) => {
        const { attributes: att } = s;
        sounds.push({
          name: att.name,
          url: att.url
        });
      });
      let newEntry: SoundDataType = {
        title: item.attributes.title,
        sounds: sounds
      }
      setSound(produce((draft) => {
        const foundIndex = draft.findIndex(item => item.title === newEntry.title);
        if (foundIndex === -1) {
          draft.push(newEntry);
        }
      }));
    });
  }, [token]);

  useEffect(() => {
    if (token) {
      getAllSound();
    }
    if (sounds && user.userConfig.id !== "0") {
      form.setFieldsValue({
        id: user.userConfig.id,
        work: JSON.stringify({ name: sounds.work.title, url: sounds.work.url }),
        short: JSON.stringify({ name: sounds.short.title, url: sounds.short.url }),
        long: JSON.stringify({ name: sounds.long.title, url: sounds.long.url })
      });
      const newData = [{
        type: "work",
        name: sounds.work.title,
        audio: new Audio(process.env.REACT_APP_SERVER_URL + sounds.work.url),
      }, {
        type: "short",
        name: sounds.short.title,
        audio: new Audio(process.env.REACT_APP_SERVER_URL + sounds.short.url),
      }, {
        type: "long",
        name: sounds.long.title,
        audio: new Audio(process.env.REACT_APP_SERVER_URL + sounds.long.url),
      }];
      setAudio(prev => ({
        ...prev,
        data: newData
      }));
    }
  }, [form, getAllSound, sounds, token, user.userConfig.id]);

  // -----------------------------------------------------
  const handleChange = (value: string, type: string) => {
    const data = JSON.parse(value);
    setAudio(prev => {
      const fIndex = prev.data.findIndex(item => item.type === type);
      let newState = Object.assign({}, prev);
      // console.log(prev);
      if (fIndex === -1) {
        let newAudioData = [...prev.data];
        newAudioData.push({
          type: type,
          audio: new Audio(process.env.REACT_APP_SERVER_URL + data.url),
          name: data.name.replace("_", " ").replace("-", " ").replace("-", " ").replace(".wav", "")
        });
        newState.data = newAudioData;
      } else {
        let newAudioData = [...prev.data];
        const sameType = newAudioData[fIndex].type;
        newAudioData[fIndex] = {
          type: sameType,
          audio: new Audio(process.env.REACT_APP_SERVER_URL + data.url),
          name: data.name.replace("_", " ").replace("-", " ").replace("-", " ").replace(".wav", "")
        }
        newState.data = newAudioData;
      }
      return newState;
    });
  }
  // -----------------------------------------------------

  useEffect(() => {
    if (audio.playing.type !== "") {
      const fIndex = audio.data.findIndex(item => item.type === audio.playing.type);
      if (fIndex !== -1) {
        audio.data[fIndex].audio.addEventListener('ended', () =>
          setAudio(produce(draft => {
            draft.playing = {
              active: false,
              type: ""
            }
          })));
      }
    }
    if (audio.data.length > 0) {
      return () => {
        audio.data.forEach(item => {
          item.audio.addEventListener('ended', () => setAudio(produce(draft => {
            draft.playing = {
              active: false,
              type: ""
            }
          })));
        });
      }
    }
  }, [audio.data, audio.playing.type]);

  useEffect(() => {
    if (audio.data.length > 0 && audio.playing.type !== "") {
      const fIndex = audio.data.findIndex(item => item.type === audio.playing.type);
      if (fIndex !== -1) {

        audio.playing.active ? audio.data[fIndex].audio.play() : audio.data[fIndex].audio.pause()
      }
    }
  }, [audio.data, audio.playing])
  // -----------------------------------------------------
  const play = useCallback((value: string) => {
    setAudio(produce(draft => {
      draft.playing = {
        active: true,
        type: value
      }
    }))
  }, []);
  // -----------------------------------------------------
  const handleSave = useCallback(async (values: ValuesType) => {
    const { work, long, short, id } = values;
    let newSoundPrefConfig = { ...sounds };

    if (work) {
      const data = JSON.parse(work)
      newSoundPrefConfig = produce(newSoundPrefConfig, (draft: PreferenceSoundType) => {
        draft.work = {
          title: data.name,
          url: data.url
        }
      });
    }
    if (short) {
      const data = JSON.parse(short)
      newSoundPrefConfig = produce(newSoundPrefConfig, (draft: PreferenceSoundType) => {
        draft.short = {
          title: data.name,
          url: data.url
        }
      });
    }
    if (long) {
      const data = JSON.parse(long)
      newSoundPrefConfig = produce(newSoundPrefConfig, (draft: PreferenceSoundType) => {
        draft.long = {
          title: data.name,
          url: data.url
        }
      });
    }
    try {
      const res = await axios(token).put(p.apiUserConfig + q.queryID(id), {
        data: {
          preferenceConfig: {
            sounds: newSoundPrefConfig
          }
        }
      });
      if (res) {
        dispatch(setPrefSoundConfig(newSoundPrefConfig));
        openNotification({
          type: 'success',
          message: "Preference config saved successfully.",
          description: ""
        });
      }
      const { data: result } = await axios(token).get(p.apiUserConfig);
      if (result.data) {
        const { id, attributes } = result.data[0];
        const controlValues = {
          id: id,
          pomoConfig: attributes.pomoConfig,
          goalsConfig: attributes.goalsConfig,
          preferenceConfig: attributes.preferenceConfig,
        }
        dispatch(setPomoConfig(controlValues));
      }
      setEdit(false);
    } catch (err) {
      if (request.isAxiosError(err) && err.response) {
        const { data } = err.response;
        const { error } = data;
        openNotification({
          type: 'error',
          message: "An error has occurred",
          description: `Error: ${error.message}`
        });
      } else {
        console.log(err);
        openNotification({
          type: 'error',
          message: "An error has occurred",
          description: `Error: unknown error.`
        });
      }
    }
  }, [dispatch, sounds, token]);
  // -----------------------------------------------------

  return (
    <Form
      className={classes.info}
      name="preference_config_form"
      form={form}
      onFinish={handleSave}
      layout="vertical"
    >
      <div className={classes.infoCtrl}>
        <Title level={4}>Preferences</Title>
        <div className={classes.infoCtrlBtn}>
          <Button
            className={clsx(classes.infoCtrlBtnInner, edit && classes.active)}
            type="primary" shape="round" htmlType="submit"
          >
            Save
          </Button>
        </div>
        <EditOutlined
          onClick={() => setEdit(prev => !prev)}
          className={clsx(classes.infoCtrlEdit, edit && classes.active)}
        />
      </div>
      <Form.Item name="id" className={classes.hidden}>
        <InputNumber
          min={0}
          className={clsx(classes.numberInput, !edit && classes.numberLabel)}
          disabled
        />
      </Form.Item>
      <div className={classes.formBody}>
        <div className={classes.formGroup}>
          {edit ? (
            <Form.Item
              className={classes.formGroupItem}
              name="work"
              label={<Text type="secondary" className={classes.labelInfoEdit}>Sound when <Text className={classes.textWork}>work</Text> is finish</Text>}

            >
              <Select
                className={classes.select}
                placeholder="Select a sound..."
                onChange={(value: string) => handleChange(value, 'work')}
                disabled={audio.playing.active}
              >
                {sound.map((item: SoundDataType) => (
                  <OptGroup
                    key={item.title}
                    label={item.title.slice(0, 1).toUpperCase() + item.title.slice(1)}

                  >
                    {item.sounds.map((e: SoundInfoType) => (
                      <Option key={e.name} value={JSON.stringify({ name: e.name.replace("_", " ").replace("-", " ").replace("-", " ").replace(".wav", ""), url: e.url })} className={classes.option}>
                        {e.name.replace("_", " ").replace("-", " ").replace("-", " ").replace(".wav", "")}
                      </Option>
                    ))}
                  </OptGroup>
                ))}
              </Select>
            </Form.Item>
          ) : (
            <div className={classes.label}>
              <Text type="secondary" className={classes.labelInfo}>Sound when <Text className={classes.textWork}>work</Text> is finish</Text>
              <Text className={classes.labelValue}>{sounds.work.title}</Text>
            </div>
          )}

          <Button
            className={classes.formGroupButton}
            type={audio.playing ? "ghost" : "primary"}
            onClick={() => play('work')}
            disabled={audio.data.findIndex(i => i.type === "work") === -1 || (audio.playing.active)}
          >
            {audio.data.findIndex(i => i.type === "work") === -1 ? "Not select" : (!audio.playing.active) ? <><PlayCircleOutlined /> Play</> : <><HourglassOutlined /> Wait</>}
          </Button>
        </div>
        <Divider className={classes.divider} />
        <div className={classes.formGroup}>
          {edit ? (
            <Form.Item
              className={classes.formGroupItem}
              name="short"
              label={<Text type="secondary" className={classes.labelInfoEdit}>Sound when <Text className={classes.textShort}>short</Text> is finish</Text>}
            >
              <Select
                className={classes.select}
                placeholder="Select a sound..."
                onChange={(value: string) => handleChange(value, 'short')}
                disabled={audio.playing.active}
              >
                {sound.map((item: SoundDataType) => (
                  <OptGroup
                    key={item.title}
                    label={item.title.slice(0, 1).toUpperCase() + item.title.slice(1)}

                  >
                    {item.sounds.map((e: SoundInfoType) => (
                      <Option key={e.name} value={JSON.stringify({ name: e.name.replace("_", " ").replace("-", " ").replace("-", " ").replace(".wav", ""), url: e.url })} className={classes.option}>
                        {e.name.replace("_", " ").replace("-", " ").replace("-", " ").replace(".wav", "")}
                      </Option>
                    ))}
                  </OptGroup>
                ))}
              </Select>
            </Form.Item>
          ) : (
            <div className={classes.label}>
              <Text type="secondary" className={classes.labelInfo}>Sound when <Text className={classes.textShort}>short</Text> is finish</Text>
              <Text className={classes.labelValue}>{sounds.short.title}</Text>
            </div>
          )}

          <Button
            className={classes.formGroupButton}
            type={audio.playing ? "ghost" : "primary"}
            onClick={() => play('short')}
            disabled={audio.data.findIndex(i => i.type === "short") === -1 || (audio.playing.active)}
          >
            {audio.data.findIndex(i => i.type === "short") === -1 ? "Not select" : (!audio.playing.active) ? <><PlayCircleOutlined /> Play</> : <><HourglassOutlined /> Wait</>}
          </Button>
        </div>
        <Divider className={classes.divider} />
        <div className={classes.formGroup}>
          {edit ? (
            <Form.Item
              className={classes.formGroupItem}
              name="long"
              label={<Text type="secondary" className={classes.labelInfoEdit}>Sound when <Text className={classes.textLong}>long</Text> is finish</Text>}
            >
              <Select
                className={classes.select}
                placeholder="Select a sound..."
                onChange={(value: string) => handleChange(value, 'long')}
                disabled={audio.playing.active}
              >
                {sound.map((item: SoundDataType) => (
                  <OptGroup
                    key={item.title}
                    label={item.title.slice(0, 1).toUpperCase() + item.title.slice(1)}
                  >
                    {item.sounds.map((e: SoundInfoType) => (
                      <Option key={e.name} value={JSON.stringify({ name: e.name.replace("_", " ").replace("-", " ").replace("-", " ").replace(".wav", ""), url: e.url })} className={classes.option}>
                        {e.name.replace("_", " ").replace("-", " ").replace("-", " ").replace(".wav", "")}
                      </Option>
                    ))}
                  </OptGroup>
                ))}
              </Select>
            </Form.Item>
          ) : (
            <div className={classes.label}>
              <Text type="secondary" className={classes.labelInfo}>Sound when <Text className={classes.textLong}>long</Text> is finish</Text>
              <Text className={classes.labelValue}>{sounds.long.title}</Text>
            </div>
          )}

          <Button
            className={classes.formGroupButton}
            type={audio.playing ? "ghost" : "primary"}
            onClick={() => play('long')}
            disabled={audio.data.findIndex(i => i.type === "long") === -1 || (audio.playing.active)}
          >
            {audio.data.findIndex(i => i.type === "long") === -1 ? "Not select" : (!audio.playing.active) ? <><PlayCircleOutlined /> Play</> : <><HourglassOutlined /> Wait</>}
          </Button>
        </div>
      </div>

    </Form>
  );
}

export default PreferenceConfigComponent