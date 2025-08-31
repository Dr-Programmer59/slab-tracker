import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, Eye, Package } from 'lucide-react';
import { useInventoryStore } from '../../store/inventory';
import { useAuthStore } from '../../store/auth';
import { usePermissions } from '../../utils/permissions';
import { Button } from '../../components/Common/Button';
import { StatusChip }