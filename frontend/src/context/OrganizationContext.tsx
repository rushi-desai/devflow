import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Organization } from '../types';
import { organizationApi } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface OrganizationContextType {
  organizations: Organization[];
  currentOrg: Organization | null;
  isLoadingOrgs: boolean;
  setCurrentOrg: (org: Organization | null) => void;
  reloadOrganizations: () => Promise<void>;
  createOrganization: (name: string) => Promise<Organization>;
  addMember: (orgId: number, memberData: { userId?: number; email?: string }) => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrg, setCurrentOrgState] = useState<Organization | null>(null);
  const [isLoadingOrgs, setIsLoadingOrgs] = useState<boolean>(false);

  const setCurrentOrg = useCallback((org: Organization | null) => {
    setCurrentOrgState(org);
    if (org) {
      localStorage.setItem('devflow_active_org_id', String(org.id));
    } else {
      localStorage.removeItem('devflow_active_org_id');
    }
  }, []);

  const reloadOrganizations = useCallback(async () => {
    if (!isAuthenticated) {
      setOrganizations([]);
      setCurrentOrgState(null);
      return;
    }

    setIsLoadingOrgs(true);
    try {
      const data = await organizationApi.list();
      setOrganizations(data);

      const savedOrgId = localStorage.getItem('devflow_active_org_id');
      if (savedOrgId) {
        const found = data.find((o) => o.id === Number(savedOrgId));
        if (found) {
          setCurrentOrgState(found);
          return;
        }
      }

      // Default to first organization if available
      if (data.length > 0) {
        setCurrentOrgState(data[0] || null);
        localStorage.setItem('devflow_active_org_id', String(data[0]?.id));
      } else {
        setCurrentOrgState(null);
      }
    } catch (err: any) {
      console.error('Failed to load organizations', err);
    } finally {
      setIsLoadingOrgs(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    reloadOrganizations();
  }, [reloadOrganizations]);

  const createOrganization = async (name: string): Promise<Organization> => {
    const newOrg = await organizationApi.create(name);
    showToast('success', 'Organization created', `"${name}" is ready to use`);
    await reloadOrganizations();
    setCurrentOrg(newOrg);
    return newOrg;
  };

  const addMember = async (orgId: number, memberData: { userId?: number; email?: string }) => {
    await organizationApi.addMember(orgId, memberData);
    showToast('success', 'Member added', 'The member now has access to this workspace');
    await reloadOrganizations();
  };

  return (
    <OrganizationContext.Provider
      value={{
        organizations,
        currentOrg,
        isLoadingOrgs,
        setCurrentOrg,
        reloadOrganizations,
        createOrganization,
        addMember
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};
