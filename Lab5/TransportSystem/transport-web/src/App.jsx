import React, { useState, useEffect } from 'react';
import { 
  Layout, Menu, Button, Table, Form, Input, Card, Space, 
  message, Tag, Popover, Avatar, Modal, Divider, List, 
  Tabs, Popconfirm, InputNumber, Alert, Select 
} from 'antd';
import { 
  UserOutlined, SettingOutlined, CarOutlined, 
  DeleteOutlined, EditOutlined, SyncOutlined, HistoryOutlined, PlusOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import './i18n';

const { Header, Content, Footer } = Layout;
const { Option } = Select;


// ПЕРЕВІР НОВІ ПОСИЛАННЯ З ПАУЕРШЕЛЛ!
// Твої нові актуальні лінки:
const AUTH_URL = "https://05l8n6bz-5152.euw.devtunnels.ms";
const TRAINS_URL = "https://5v6hx7v5-5153.euw.devtunnels.ms";

const AUTH_API = `${AUTH_URL}/api/Auth`;
const TRAINS_API = `${TRAINS_URL}/api/Trains`;


function App() {
  const { t, i18n } = useTranslation();
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [trains, setTrains] = useState([]);
  const [stations, setStations] = useState([]); 
  const [history, setHistory] = useState([]);
  const [view, setView] = useState('login');
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // Состояния для редактирования остановок
  const [editingStop, setEditingStop] = useState(null);
  const [isEditStopModal, setIsEditStopModal] = useState(false);

  const headers = { "X-Tunnel-Skip-AntiPhishing-Page": "true" };

  // --- 1. ЗАГРУЗКА ДАННЫХ ---
  //const fetchAllData = async () => {
  //  try {
  //    const tRes = await axios.get(`${AUTH_API}/trains`, { headers });
  //    setTrains(tRes.data);

  //    const sRes = await axios.get(`${TRAINS_API}/stations/all`, { headers });
  //    setStations(sRes.data.sort((a, b) => a.id - b.id));
  //  } catch (err) {
  //    console.error("Data Load Error", err);
  //  }
  //};
const fetchAllData = async () => {
    try {
      const headers = { "X-Tunnel-Skip-AntiPhishing-Page": "true" };

      // ТЕПЕР ТІЛЬКИ ТАК: список поїздів беремо з сервісу ТРАНСПОРТУ (5153)
      
      const tRes = await axios.get(TRAINS_API, { headers }); // БЕЗ /trains в кінці
      setTrains(tRes.data);

      const sRes = await axios.get(`${TRAINS_API}/stations/all`, { headers });
      setStations(sRes.data.sort((a, b) => a.id - b.id));
    } catch (err) {
      console.error("Data Load Error", err);
    }
};

  useEffect(() => {
    if (role) fetchAllData();
  }, [role]);

  // --- 2. АВТОРИЗАЦИЯ ---
  const onLogin = async (values) => {
    try {
      const res = await axios.post(`${AUTH_API}/login`, null, {
        params: { email: values.email, password: values.password },
        headers
      });
      setRole(res.data.role);
      setUserId(res.data.userId || res.data.UserId);
      setUserEmail(values.email);
      setUserName(res.data.message.split(', ')[1]?.replace('!', '') || "User");
      setView(res.data.role === 'Admin' ? 'admin' : 'schedule');
      fetchAllData();
      message.success(res.data.message);
    } catch (err) { message.error("Login Error"); }
  };

  const onRegister = async (values) => {
    try {
      await axios.post(`${AUTH_API}/register`, null, {
        params: { name: values.name, email: values.email, password: values.password },
        headers
      });
      message.success("Success! Please Login.");
      setView('login');
    } catch (err) { message.error("Register Error"); }
  };

  // --- 3. АДМИН-ДЕЙСТВИЯ ---
  const handleAddTrain = async (values) => {
    try {
      await axios.post(`${TRAINS_API}/add-basic`, null, { params: { number: values.number, role }, headers });
      message.success(t('add_train') + " OK");
      fetchAllData();
    } catch (e) { message.error("Error adding bus"); }
  };

  const handleCreateStation = async (values) => {
    try {
      await axios.post(`${TRAINS_API}/stations/create`, null, { params: { name: values.name, role }, headers });
      message.success(t('create_station_title') + " OK");
      fetchAllData();
    } catch (e) { message.error("Error creating station"); }
  };

  const exportData = () => {
    const backup = {
      date: new Date().toLocaleString(),
      stations: stations,
      buses: trains.map(t => ({
        number: t.number,
        delay: t.delayMinutes,
        route: (t.route || t.Route || []).sort((a,b) => (a.order || a.Order) - (b.order || b.Order)).map(r => ({
          order: r.order,
          station: r.station?.name || r.Station?.Name,
          arrival: r.scheduledArrival,
          departure: r.scheduledDeparture
        }))
      }))
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", "Transport_Backup.json");
    dl.click();
  };

  const showStops = (train) => {
    const r = [...(train.route || train.Route || [])].sort((a,b) => (a.order || a.Order) - (b.order || b.Order));
    setSelectedTrain({ ...train, displayRoute: r });
    setIsModalVisible(true);
    if(role === 'Client') axios.post(`${AUTH_API}/view`, null, { params: { userId, trainId: train.id }, headers });
  };

  const columns = [
    { title: t('train_number'), dataIndex: 'number', render: (text, record) => <Button type="link" onClick={() => showStops(record)}>{text}</Button> },
    { title: t('delay'), dataIndex: 'delayMinutes', render: (d) => <Tag color={d > 0 ? 'red' : 'green'}>{d > 0 ? `+${d} ${t('min')}` : t('on_time')}</Tag> }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#001529', padding: '0 20px' }}>
        <div style={{ color: 'white', fontWeight: 'bold' }}>TRANSPORT SYSTEM</div>
        <Space>
          <Button ghost size="small" onClick={() => i18n.changeLanguage('ua')}>UA</Button>
          <Button ghost size="small" onClick={() => i18n.changeLanguage('en')}>EN</Button>
          {role && <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />}
          {role && <Button type="link" danger onClick={() => {setRole(null); setView('login')}}>{t('logout')}</Button>}
        </Space>
      </Header>

      <Content style={{ padding: '30px' }}>
        {view === 'login' && (
          <Card style={{ maxWidth: 400, margin: '80px auto' }} title={t('please_login')}>
            <Form onFinish={onLogin} layout="vertical">
              <Form.Item name="email" label="Email"><Input /></Form.Item>
              <Form.Item name="password" label="Password"><Input.Password /></Form.Item>
              <Button type="primary" htmlType="submit" block>{t('login_btn')}</Button>
              <Button type="link" block onClick={() => setView('register')}>{t('no_account')}</Button>
            </Form>
          </Card>
        )}

        {view === 'register' && (
          <Card style={{ maxWidth: 400, margin: '80px auto' }} title={t('registration_title')}>
            <Form onFinish={onRegister} layout="vertical">
              <Form.Item name="name" label={t('user_name')}><Input /></Form.Item>
              <Form.Item name="email" label="Email"><Input /></Form.Item>
              <Form.Item name="password" label="Password"><Input.Password /></Form.Item>
              <Button type="primary" htmlType="submit" block>{t('register_btn')}</Button>
              <Button type="link" block onClick={() => setView('login')}>{t('already_account')}</Button>
            </Form>
          </Card>
        )}


        

{(view === 'schedule' || view === 'admin' || view === 'history') && (
  <div style={{ background: '#fff', padding: '24px', borderRadius: '8px' }}>
    
    {/* Панель керування: Адмін бачить кнопку панелі, Клієнт бачить кнопку розкладу */}
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
       <Space>
         {role === 'Admin' ? (
           <Tag color="gold" icon={<SettingOutlined />}>{t('admin_panel')}</Tag>
         ) : (
           <Tag color="blue" icon={<CarOutlined />}>{t('train_schedule')}</Tag>
         )}
       </Space>
       <Button icon={<SyncOutlined />} onClick={fetchAllData}>{t('refresh_btn')}</Button>
    </div>

    {role === 'Admin' ? (
      // --- ПАНЕЛЬ АДМІНІСТРАТОРА (ВКЛАДКИ) ---
      <Tabs items={[
        { key: '1', label: t('train_schedule'), children: (
          <>
            <Card size="small" title={t('add_train')} style={{ marginBottom: 20 }}>
              <Form layout="inline" onFinish={handleAddTrain}>
                <Form.Item name="number" rules={[{required: true}]}><Input placeholder="№ 123" /></Form.Item>
                <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>{t('add_btn')}</Button>
              </Form>
            </Card>
            <Table dataSource={trains} rowKey="id" columns={[...columns, { title: t('actions'), render: (_, r) => (
              <Space>
                 <Button icon={<EditOutlined />} onClick={() => {
                   const n = prompt("New number:", r.number);
                   if(n) axios.put(`${TRAINS_API}/edit-number/${r.id}`, null, { params: { newNumber: n, role }, headers }).then(fetchAllData);
                 }} />
                 <Popconfirm title="Delete?" onConfirm={() => axios.delete(`${TRAINS_API}/${r.id}`, { params: { role }, headers }).then(fetchAllData)}>
                   <Button danger icon={<DeleteOutlined />} />
                 </Popconfirm>
              </Space>
            )}]} />
          </>
        )},
        { key: '2', label: t('stations_tab'), children: (
          <div style={{ display: 'flex', gap: '30px' }}>
            <Card title={t('create_station_title')} size="small" style={{ width: 300 }}>
              <Form onFinish={handleCreateStation} layout="vertical">
                <Form.Item name="name" label={t('station')} rules={[{required: true}]}><Input /></Form.Item>
                <Button type="primary" htmlType="submit" block>{t('add_btn')}</Button>
              </Form>
            </Card>
            <Table size="small" style={{ flex: 1 }} dataSource={stations} rowKey="id" columns={[
              { title: 'ID', dataIndex: 'id', width: 80, render: (id) => <Tag color="blue">#{id}</Tag> }, 
              { title: t('station'), dataIndex: 'name' },
              { title: t('delete'), render: (_, r) => <Button danger size="small" icon={<DeleteOutlined />} onClick={async () => {
                  await axios.delete(`${TRAINS_API}/stations/${r.id}`, { params: { role }, headers });
                  fetchAllData();
              }} /> }
            ]} />
          </div>
        )},
        { key: '3', label: t('system_tab'), children: <Button onClick={exportData}>{t('export_json')}</Button> }
      ]} />
    ) : (
      // --- ПАНЕЛЬ КЛІЄНТА (ТЕПЕР ТЕЖ ТАБИ!) ---
      <Tabs 
        defaultActiveKey="1" 
        onChange={(key) => {
          if (key === '2') {
             // Автоматично підвантажуємо історію при переході на вкладку
             axios.get(`${AUTH_API}/history/${userId}`, { headers }).then(res => setHistory(res.data));
          }
        }}
        items={[
        { 
          key: '1', 
          label: <span><CarOutlined />{t('train_schedule')}</span>, 
          children: <Table dataSource={trains} columns={columns} rowKey="id" /> 
        },
        { 
          key: '2', 
          label: <span><HistoryOutlined />{t('my_history')}</span>, 
          children: <Table dataSource={history} columns={[
            { title: t('train_number'), dataIndex: 'trainNumber' }, 
            { title: t('date'), dataIndex: 'viewedAt', render: (val) => <Tag color="cyan">{val}</Tag> }
          ]} rowKey="viewedAt" /> 
        }
      ]} />
    )}
  </div>
)}
        

        {/* MODAL STOPS (Список остановок с кнопками Редактировать/Удалить) */}
        <Modal title={`${t('stops')} - ${selectedTrain?.number}`} open={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null} width={700}>
          {role === 'Admin' && (
            <Card size="small" title={t('add_btn')} style={{ marginBottom: 20 }}>
              <Form layout="inline" onFinish={async (v) => {
                await axios.post(`${TRAINS_API}/add-stop-to-route`, null, { params: { ...v, trainId: selectedTrain.id, role }, headers });
                fetchAllData(); setIsModalVisible(false);
              }}>
                <Form.Item name="stationId" style={{ width: 180 }}>
                  <Select placeholder={t('select_station')}>
                    {stations.map(s => <Option key={s.id} value={s.id}>{s.name}</Option>)}
                  </Select>
                </Form.Item>
                <Form.Item name="arrival"><Input placeholder="00:00" style={{ width: 80 }} /></Form.Item>
                <Form.Item name="departure"><Input placeholder="00:00" style={{ width: 80 }} /></Form.Item>
                <Form.Item name="order"><InputNumber placeholder="№" style={{ width: 60 }} /></Form.Item>
                <Button type="primary" htmlType="submit">+</Button>
              </Form>
            </Card>
          )}
          <List dataSource={selectedTrain?.displayRoute || []} renderItem={item => (
            <List.Item actions={role === 'Admin' ? [
              <Button icon={<EditOutlined />} onClick={() => { setEditingStop(item); setIsEditStopModal(true); }} />,
              <Popconfirm title="Delete stop?" onConfirm={async () => {
                await axios.delete(`${TRAINS_API}/stop/${item.id}`, { params: { role }, headers });
                fetchAllData(); setIsModalVisible(false);
              }}>
                <Button danger icon={<DeleteOutlined />} />
              </Popconfirm>
            ] : []}>
              <List.Item.Meta 
                avatar={<Tag color="blue">{item.order}</Tag>} 
                title={item.station?.name || item.Station?.Name} 
                description={`${t('arrival')}: ${item.scheduledArrival} | ${t('departure')}: ${item.scheduledDeparture}`} 
              />
            </List.Item>
          )} />
        </Modal>

        {/* МОДАЛКА РЕДАКТИРОВАНИЯ ОСТАНОВКИ */}
        <Modal 
          title={t('edit')} 
          open={isEditStopModal} 
          onCancel={() => setIsEditStopModal(false)} 
          onOk={async () => {
            await axios.put(`${TRAINS_API}/schedule/edit-stop/${editingStop.id}`, null, {
              params: { 
                newArrival: editingStop.scheduledArrival, 
                newDeparture: editingStop.scheduledDeparture, 
                newOrder: editingStop.order, 
                role 
              },
              headers
            });
            fetchAllData(); 
            setIsEditStopModal(false); 
            setIsModalVisible(false);
          }}
        >
          <Form layout="vertical">
            <Form.Item label={t('arrival')}>
              <Input value={editingStop?.scheduledArrival} onChange={e => setEditingStop({...editingStop, scheduledArrival: e.target.value})} />
            </Form.Item>
            <Form.Item label={t('departure')}>
              <Input value={editingStop?.scheduledDeparture} onChange={e => setEditingStop({...editingStop, scheduledDeparture: e.target.value})} />
            </Form.Item>
            <Form.Item label={t('order')}>
              <InputNumber value={editingStop?.order} onChange={val => setEditingStop({...editingStop, order: val})} />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Transport System Lab ©2026</Footer>
    </Layout>
  );
}

export default App;