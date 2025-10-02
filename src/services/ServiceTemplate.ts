import { logger } from '@/utils/logger';
import { AuthException, PermissionException } from '@/exceptions/AuthException';

/**
 * Abstract base template for all services in the application
 * Implements common functionality and dependency injection pattern
 */
export abstract class ServiceTemplate {
  protected serviceName: string;
  protected dependencies: Map<string, any> = new Map();

  constructor(serviceName: string) {
    this.serviceName = serviceName;
    logger.info(`Service initialized: ${serviceName}`);
  }

  /**
   * Validate user permissions for service operations
   */
  protected async validatePermissions(
    requiredRole?: string, 
    requiredPermissions: string[] = []
  ): Promise<void> {
    // Get current user from authentication context
    const currentUser = this.getCurrentUser();
    
    if (!currentUser) {
      throw new AuthException('Authentication required', {
        service: this.serviceName,
        operation: 'validatePermissions'
      });
    }

    // Check role-based access
    if (requiredRole && currentUser.role !== requiredRole && currentUser.role !== 'admin') {
      throw new PermissionException(`Required role: ${requiredRole}`, {
        service: this.serviceName,
        userRole: currentUser.role,
        requiredRole
      });
    }

    // Check specific permissions
    if (requiredPermissions.length > 0) {
      const missingPermissions = requiredPermissions.filter(
        permission => !currentUser.permissions?.includes(permission)
      );

      if (missingPermissions.length > 0) {
        throw new PermissionException('Insufficient permissions', {
          service: this.serviceName,
          missingPermissions,
          userPermissions: currentUser.permissions
        });
      }
    }

    logger.debug('Permission validation successful', {
      service: this.serviceName,
      userId: currentUser.id,
      userRole: currentUser.role
    });
  }

  /**
   * Get current authenticated user
   */
  private getCurrentUser(): any {
    // This would typically come from your auth context (Redux store, context, etc.)
    try {
      const authState = localStorage.getItem('authState');
      return authState ? JSON.parse(authState).user : null;
    } catch (error) {
      logger.error('Failed to get current user', error as Error);
      return null;
    }
  }

  /**
   * Execute service operation with common error handling and logging
   */
  protected async executeServiceOperation<T>(
    operationName: string,
    operation: () => Promise<T>,
    options: {
      requiresAuth?: boolean;
      requiredRole?: string;
      requiredPermissions?: string[];
      logLevel?: 'info' | 'debug';
    } = {}
  ): Promise<T> {
    const {
      requiresAuth = true,
      requiredRole,
      requiredPermissions = [],
      logLevel = 'info'
    } = options;

    const operationId = `${this.serviceName}.${operationName}`;
    
    try {
      // Validate permissions if required
      if (requiresAuth) {
        await this.validatePermissions(requiredRole, requiredPermissions);
      }

      // Log operation start
      if (logLevel === 'info') {
        logger.info(`Service operation started: ${operationId}`);
      } else {
        logger.debug(`Service operation started: ${operationId}`);
      }

      // Execute the operation
      const startTime = Date.now();
      const result = await operation();
      const duration = Date.now() - startTime;

      // Log successful completion
      if (logLevel === 'info') {
        logger.info(`Service operation completed: ${operationId}`, {
          duration: `${duration}ms`,
          service: this.serviceName,
          operation: operationName
        });
      } else {
        logger.debug(`Service operation completed: ${operationId}`, {
          duration: `${duration}ms`
        });
      }

      return result;

    } catch (error) {
      // Log operation failure
      logger.error(`Service operation failed: ${operationId}`, error as Error, {
        service: this.serviceName,
        operation: operationName,
        requiresAuth,
        requiredRole,
        requiredPermissions
      });

      // Re-throw the error for the caller to handle
      throw error;
    }
  }

  /**
   * Register a dependency for dependency injection
   */
  public registerDependency<T>(key: string, dependency: T): void {
    this.dependencies.set(key, dependency);
    logger.debug(`Dependency registered: ${key}`, {
      service: this.serviceName,
      dependency: key
    });
  }

  /**
   * Get a registered dependency
   */
  protected getDependency<T>(key: string): T {
    const dependency = this.dependencies.get(key);
    if (!dependency) {
      throw new Error(`Dependency not found: ${key}`);
    }
    return dependency as T;
  }

  /**
   * Check if a dependency is registered
   */
  protected hasDependency(key: string): boolean {
    return this.dependencies.has(key);
  }

  /**
   * Common validation method for service inputs
   */
  protected validateInput(input: any, rules: { [key: string]: (value: any) => boolean }): void {
    for (const [field, validator] of Object.entries(rules)) {
      if (!validator(input[field])) {
        throw new Error(`Validation failed for field: ${field}`);
      }
    }
  }

  /**
   * Generate a unique operation ID for tracking
   */
  protected generateOperationId(prefix: string = 'op'): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Cleanup resources when service is no longer needed
   */
  public dispose(): void {
    this.dependencies.clear();
    logger.info(`Service disposed: ${this.serviceName}`);
  }
}

/**
 * Interface that all services should implement
 */
export interface IService {
  serviceName: string;
  dispose(): void;
}

/**
 * Example usage for developers:
 * 
 * class MyService extends ServiceTemplate implements IService {
 *   constructor() {
 *     super('MyService');
 *   }
 * 
 *   public async myOperation(data: any): Promise<any> {
 *     return this.executeServiceOperation(
 *       'myOperation',
 *       async () => {
 *         // Your operation logic here
 *         await this.validatePermissions('user', ['my-operation:execute']);
 *         
 *         // Use dependencies
 *         const apiClient = this.getDependency('apiClient');
 *         return await apiClient.post('/endpoint', data);
 *       },
 *       {
 *         requiresAuth: true,
 *         requiredRole: 'user',
 *         logLevel: 'info'
 *       }
 *     );
 *   }
 * }
 * 
 * // Usage:
 * const service = new MyService();
 * service.registerDependency('apiClient', apiClientInstance);
 */
