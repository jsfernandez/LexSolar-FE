"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { QrCode, Plus, Trash2, Shield } from "lucide-react"

type ComponentStatus = "new" | "used" | "refurbished"

type Component = {
  id: string
  type: string
  brand: string
  model: string
  serialNumber: string
  power?: string
  status?: ComponentStatus
  manufacturingYear?: string
  efficiency?: string
  warranty?: string
  origin?: string
  specifications?: string
}

export default function ComponentRegistryForm() {
  const [components, setComponents] = useState<Component[]>([])

  const addComponent = () => {
    setComponents([...components, {
      id: Date.now().toString(),
      type: "",
      brand: "",
      model: "",
      serialNumber: "",
      power: ""
    }])
  }

  const removeComponent = (id: string) => {
    setComponents(components.filter(c => c.id !== id))
  }

  const updateComponent = (id: string, field: keyof Component, value: string) => {
    setComponents(components.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registro de Componentes</CardTitle>
        <CardDescription>
          Registre todos los componentes de la instalación. Use el escáner QR para facilitar el proceso.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {components.map((component) => (
          <div key={component.id} className="grid gap-4 p-6 border rounded-lg bg-slate-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label>Tipo de Componente</Label>
                <Select 
                  value={component.type}
                  onValueChange={(value) => updateComponent(component.id, "type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="panel">Panel Solar</SelectItem>
                    <SelectItem value="inverter">Inversor</SelectItem>
                    <SelectItem value="battery">Batería</SelectItem>
                    <SelectItem value="microinverter">Microinversor</SelectItem>
                    <SelectItem value="optimizer">Optimizador</SelectItem>
                    <SelectItem value="chargeController">Controlador de Carga</SelectItem>
                    <SelectItem value="protections">Protecciones</SelectItem>
                    <SelectItem value="meter">Medidor</SelectItem>
                    <SelectItem value="monitoring">Sistema de Monitoreo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Estado</Label>
                <Select 
                  value={component.status || "new"}
                  onValueChange={(value) => updateComponent(component.id, "status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Nuevo</SelectItem>
                    <SelectItem value="used">Usado</SelectItem>
                    <SelectItem value="refurbished">Reacondicionado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Marca</Label>
                <Input
                  value={component.brand}
                  onChange={(e) => updateComponent(component.id, "brand", e.target.value)}
                  placeholder="Ej: SunPower"
                />
              </div>
              <div>
                <Label>Modelo</Label>
                <Input
                  value={component.model}
                  onChange={(e) => updateComponent(component.id, "model", e.target.value)}
                  placeholder="Ej: SPR-X22-360"
                />
              </div>
              <div>
                <Label>Número de Serie</Label>
                <div className="flex gap-2">
                  <Input
                    value={component.serialNumber}
                    onChange={(e) => updateComponent(component.id, "serialNumber", e.target.value)}
                    placeholder="Ej: SP12345678"
                  />
                  <Button variant="outline" size="icon">
                    <QrCode className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Potencia Nominal (W)</Label>
                <Input
                  type="number"
                  value={component.power || ""}
                  onChange={(e) => updateComponent(component.id, "power", e.target.value)}
                  placeholder="Ej: 360"
                />
              </div>
              <div>
                <Label>Año de Fabricación</Label>
                <Input
                  type="number"
                  min={2000}
                  max={2025}
                  value={component.manufacturingYear || ""}
                  onChange={(e) => updateComponent(component.id, "manufacturingYear", e.target.value)}
                  placeholder="Ej: 2023"
                />
              </div>
              <div>
                <Label>Eficiencia (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min={0}
                  max={100}
                  value={component.efficiency || ""}
                  onChange={(e) => updateComponent(component.id, "efficiency", e.target.value)}
                  placeholder="Ej: 21.5"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Garantía (años)</Label>
                <Input
                  type="number"
                  value={component.warranty || ""}
                  onChange={(e) => updateComponent(component.id, "warranty", e.target.value)}
                  placeholder="Ej: 25"
                />
              </div>
              <div>
                <Label>Origen</Label>
                <Input
                  value={component.origin || ""}
                  onChange={(e) => updateComponent(component.id, "origin", e.target.value)}
                  placeholder="País de fabricación"
                />
              </div>
            </div>

            <div>
              <Label>Especificaciones Técnicas Adicionales</Label>
              <Textarea
                value={component.specifications || ""}
                onChange={(e) => updateComponent(component.id, "specifications", e.target.value)}
                placeholder="Ingrese detalles técnicos adicionales..."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => removeComponent(component.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar Componente
              </Button>
              <Button 
                variant="secondary" 
                size="sm"
              >
                <Shield className="h-4 w-4 mr-2" />
                Verificar Garantía
              </Button>
            </div>
          </div>
        ))}

        <Button onClick={addComponent} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Componente
        </Button>

        {components.length > 0 && (
          <div className="p-4 border rounded-lg bg-blue-50 text-blue-800">
            <h4 className="font-medium mb-2">Resumen de Componentes</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>{components.filter(c => c.type === "panel").length} Paneles Solares</li>
              <li>{components.filter(c => c.type === "inverter").length} Inversores</li>
              <li>{components.filter(c => c.type === "battery").length} Baterías</li>
              <li>{components.filter(c => ["microinverter", "optimizer", "chargeController"].includes(c.type)).length} Otros componentes</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}