import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  
  // 重定向到营销看板首页
  useEffect(() => {
    navigate('/marketing-expense');
  }, [navigate]);
  
  return null;
}