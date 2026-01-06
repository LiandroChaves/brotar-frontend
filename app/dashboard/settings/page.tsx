"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Database, FileText, Shield, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
                <p className="text-muted-foreground">Gerencie as configurações do sistema</p>
            </div>

            <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                    As configurações detalhadas serão implementadas conforme necessidade do sistema. Por enquanto, você pode
                    gerenciar os dados através dos módulos específicos.
                </AlertDescription>
            </Alert>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Database className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle>Dados do Sistema</CardTitle>
                                <CardDescription>Informações gerais cadastradas</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Produtores</span>
                                <span className="font-medium">Gerenciar em Produtores</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Propriedades</span>
                                <span className="font-medium">Gerenciar em Propriedades</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Domínios</span>
                                <span className="font-medium">Gerenciar em Domínios/Itens</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-600/10 rounded-lg">
                                <FileText className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                                <CardTitle>Relatórios</CardTitle>
                                <CardDescription>Geração de documentos</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Formato</span>
                                <span className="font-medium">PDF (A4)</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Template</span>
                                <span className="font-medium">Formulário Completo</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Status</span>
                                <span className="font-medium text-emerald-600">Ativo</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-600/10 rounded-lg">
                                <Shield className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                                <CardTitle>Segurança</CardTitle>
                                <CardDescription>Controle de acesso</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Administradores</span>
                                <span className="font-medium">Gerenciar em Administradores</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Autenticação</span>
                                <span className="font-medium text-emerald-600">JWT Bearer Token</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Sessão</span>
                                <span className="font-medium">Cookies HTTP-Only</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-600/10 rounded-lg">
                                <Settings className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <CardTitle>Sistema</CardTitle>
                                <CardDescription>Informações da aplicação</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Nome</span>
                                <span className="font-medium">Brotar Admin</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Versão</span>
                                <span className="font-medium">1.0.0</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Ambiente</span>
                                <span className="font-medium">Produção</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
